import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LanguageService } from '../i18n/language.service';
import { BusService } from '../service/bus.service';
import { NotificationService } from '../service/notification.service';

declare global {
  interface Window {
    google: any;
  }
}

type CompareMode = 'time' | 'distance' | 'traffic';

interface PlannerRouteOption {
  index: number;
  summary: string;
  distanceText: string;
  durationText: string;
  durationInTrafficText: string;
  durationMinutes: number;
  durationInTrafficMinutes: number;
  distanceMeters: number;
  congestionLevel: 'low' | 'medium' | 'high';
  trafficDelayMinutes: number;
  recommended: boolean;
}

interface SavedRoutePlan {
  id: string;
  from: string;
  to: string;
  waypoints: string[];
  compareMode: CompareMode;
  savedAt: string;
}

@Component({
  selector: 'app-route-planner',
  templateUrl: './route-planner.component.html',
  styleUrls: ['./route-planner.component.css']
})
export class RoutePlannerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;

  from = '';
  to = '';
  waypoints: string[] = [''];
  compareMode: CompareMode = 'time';
  compareModes: Array<{ key: CompareMode; labelKey: string }> = [
    { key: 'time', labelKey: 'routePlanner.compareTime' },
    { key: 'distance', labelKey: 'routePlanner.compareDistance' },
    { key: 'traffic', labelKey: 'routePlanner.compareTraffic' }
  ];
  routeOptions: PlannerRouteOption[] = [];
  savedRoutes: SavedRoutePlan[] = [];
  plannerMessage = '';
  plannerError = '';
  selectedRouteIndex = 0;
  planning = false;
  lastUpdated = '';
  autoRefresh = true;
  busId = '';
  departureTime = '';
  arrivalTime = '';
  effectiveDate = '';
  note = '';
  updatingSchedule = false;
  scheduleMessage = '';
  promoTitle = '';
  promoMessage = '';
  promoOfferTitle = '';
  sendingPromo = false;
  promoMessageStatus = '';
  private readonly savedRoutesKey = 'saved_route_plans';
  private map: any;
  private directionsService: any;
  private directionsRenderer: any;
  private trafficLayer: any;
  private latestDirectionsResult: any = null;
  private refreshTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private busService: BusService,
    private notificationService: NotificationService,
    private languageService: LanguageService
  ) {}

  ngAfterViewInit(): void {
    this.savedRoutes = this.readSavedRoutes();
    this.initializeMap();
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  initializeMap(): void {
    if (!this.mapContainer || !window.google?.maps) {
      this.plannerError = this.languageService.translate('routePlanner.mapUnavailable');
      return;
    }

    this.map = new window.google.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: 28.6139, lng: 77.2090 },
      zoom: 6,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    });

    this.directionsService = new window.google.maps.DirectionsService();
    this.directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#d84e55',
        strokeWeight: 6
      }
    });

    this.trafficLayer = new window.google.maps.TrafficLayer();
    this.trafficLayer.setMap(this.map);
    this.plannerError = '';
  }

  addWaypoint(): void {
    this.waypoints.push('');
  }

  removeWaypoint(index: number): void {
    if (this.waypoints.length === 1) {
      this.waypoints[0] = '';
      return;
    }

    this.waypoints.splice(index, 1);
  }

  showRoute(forceRefresh = false): void {
    if (!this.from.trim() || !this.to.trim()) {
      this.plannerError = this.languageService.translate('routePlanner.originDestinationRequired');
      return;
    }

    if (!this.directionsService || !this.directionsRenderer) {
      this.initializeMap();
      if (!this.directionsService) {
        return;
      }
    }

    this.planning = true;
    this.plannerError = '';
    this.plannerMessage = '';

    const cleanedWaypoints = this.waypoints
      .map(waypoint => waypoint.trim())
      .filter(Boolean)
      .map(location => ({
        location,
        stopover: true
      }));

    const request = {
      origin: this.from.trim(),
      destination: this.to.trim(),
      waypoints: cleanedWaypoints,
      travelMode: window.google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
      drivingOptions: {
        departureTime: new Date(),
        trafficModel: window.google.maps.TrafficModel.BEST_GUESS
      }
    };

    const previousBest = this.routeOptions[0];

    this.directionsService.route(request, (result: any, status: string) => {
      this.planning = false;

      if (status !== 'OK' || !result?.routes?.length) {
        this.plannerError = this.languageService.translate('routePlanner.routeSearchFailed');
        return;
      }

      this.latestDirectionsResult = result;
      this.routeOptions = this.buildRouteOptions(result.routes);
      this.sortRouteOptions();
      this.selectedRouteIndex = this.routeOptions[0]?.index ?? 0;
      this.renderSelectedRoute(this.selectedRouteIndex);
      this.lastUpdated = new Date().toLocaleTimeString();

      if (!forceRefresh) {
        this.plannerMessage = this.languageService.translate('routePlanner.routesReady', {
          count: this.routeOptions.length
        });
      }

      if (previousBest) {
        const currentBest = this.routeOptions[0];
        const delayDifference = currentBest.durationInTrafficMinutes - previousBest.durationInTrafficMinutes;
        if (Math.abs(delayDifference) >= 5 || currentBest.congestionLevel !== previousBest.congestionLevel) {
          this.plannerMessage = this.languageService.translate('routePlanner.trafficUpdated', {
            delay: Math.max(0, Math.round(delayDifference))
          });
        }
      }

      this.setupAutoRefresh();
    });
  }

  selectRoute(routeIndex: number): void {
    this.selectedRouteIndex = routeIndex;
    this.renderSelectedRoute(routeIndex);
  }

  sortRouteOptions(): void {
    this.routeOptions = [...this.routeOptions].sort((left, right) => {
      if (this.compareMode === 'distance') {
        return left.distanceMeters - right.distanceMeters;
      }

      if (this.compareMode === 'traffic') {
        return left.trafficDelayMinutes - right.trafficDelayMinutes;
      }

      return left.durationInTrafficMinutes - right.durationInTrafficMinutes;
    }).map((route, index) => ({
      ...route,
      recommended: index === 0
    }));
  }

  onCompareModeChange(): void {
    if (!this.routeOptions.length) {
      return;
    }

    this.sortRouteOptions();
    this.selectedRouteIndex = this.routeOptions[0].index;
    this.renderSelectedRoute(this.selectedRouteIndex);
  }

  saveCurrentRoute(): void {
    if (!this.from.trim() || !this.to.trim()) {
      this.plannerError = this.languageService.translate('routePlanner.originDestinationRequired');
      return;
    }

    const savedRoutes = this.readSavedRoutes();
    const routeToSave: SavedRoutePlan = {
      id: `${Date.now()}`,
      from: this.from.trim(),
      to: this.to.trim(),
      waypoints: this.waypoints.map(waypoint => waypoint.trim()).filter(Boolean),
      compareMode: this.compareMode,
      savedAt: new Date().toISOString()
    };

    const dedupedRoutes = [
      routeToSave,
      ...savedRoutes.filter(savedRoute =>
        !(savedRoute.from === routeToSave.from &&
          savedRoute.to === routeToSave.to &&
          JSON.stringify(savedRoute.waypoints) === JSON.stringify(routeToSave.waypoints))
      )
    ].slice(0, 8);

    localStorage.setItem(this.savedRoutesKey, JSON.stringify(dedupedRoutes));
    this.savedRoutes = dedupedRoutes;
    this.plannerMessage = this.languageService.translate('routePlanner.routeSaved');
  }

  loadSavedRoute(route: SavedRoutePlan): void {
    this.from = route.from;
    this.to = route.to;
    this.waypoints = route.waypoints.length ? [...route.waypoints] : [''];
    this.compareMode = route.compareMode;
    this.showRoute();
  }

  removeSavedRoute(routeId: string): void {
    this.savedRoutes = this.readSavedRoutes().filter(route => route.id !== routeId);
    localStorage.setItem(this.savedRoutesKey, JSON.stringify(this.savedRoutes));
  }

  refreshTraffic(): void {
    if (!this.latestDirectionsResult && (!this.from.trim() || !this.to.trim())) {
      this.plannerError = this.languageService.translate('routePlanner.originDestinationRequired');
      return;
    }

    this.showRoute(true);
  }

  formatWaypoints(route: SavedRoutePlan): string {
    if (!route.waypoints.length) {
      return this.languageService.translate('routePlanner.noWaypoints');
    }

    return route.waypoints.join(', ');
  }

  getCompareLabel(labelKey: string): string {
    return this.languageService.translate(labelKey);
  }

  private renderSelectedRoute(routeIndex: number): void {
    if (!this.latestDirectionsResult || !this.directionsRenderer) {
      return;
    }

    this.directionsRenderer.setDirections(this.latestDirectionsResult);
    this.directionsRenderer.setRouteIndex(routeIndex);
  }

  private buildRouteOptions(routes: any[]): PlannerRouteOption[] {
    return routes.map((route, index) => {
      const metrics = route.legs.reduce((accumulator: any, leg: any) => {
        accumulator.distanceMeters += leg.distance?.value || 0;
        accumulator.durationMinutes += Math.round((leg.duration?.value || 0) / 60);
        accumulator.durationInTrafficMinutes += Math.round(((leg.duration_in_traffic?.value || leg.duration?.value || 0)) / 60);
        return accumulator;
      }, {
        distanceMeters: 0,
        durationMinutes: 0,
        durationInTrafficMinutes: 0
      });

      const trafficDelayMinutes = Math.max(0, metrics.durationInTrafficMinutes - metrics.durationMinutes);
      let congestionLevel: 'low' | 'medium' | 'high' = 'low';

      if (trafficDelayMinutes >= 15) {
        congestionLevel = 'high';
      } else if (trafficDelayMinutes >= 6) {
        congestionLevel = 'medium';
      }

      return {
        index,
        summary: route.summary || this.languageService.translate('routePlanner.routeOption', { index: index + 1 }),
        distanceText: this.formatDistance(metrics.distanceMeters),
        durationText: this.formatDuration(metrics.durationMinutes),
        durationInTrafficText: this.formatDuration(metrics.durationInTrafficMinutes),
        durationMinutes: metrics.durationMinutes,
        durationInTrafficMinutes: metrics.durationInTrafficMinutes,
        distanceMeters: metrics.distanceMeters,
        congestionLevel,
        trafficDelayMinutes,
        recommended: false
      };
    });
  }

  private formatDistance(distanceMeters: number): string {
    return `${(distanceMeters / 1000).toFixed(1)} km`;
  }

  private formatDuration(durationMinutes: number): string {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours === 0) {
      return `${minutes} min`;
    }

    if (minutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${minutes} min`;
  }

  private readSavedRoutes(): SavedRoutePlan[] {
    const saved = localStorage.getItem(this.savedRoutesKey);
    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved) as SavedRoutePlan[];
    } catch {
      return [];
    }
  }

  setupAutoRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }

    if (!this.autoRefresh) {
      return;
    }

    this.refreshTimer = setInterval(() => {
      this.showRoute(true);
    }, 60000);
  }

  updateSchedule(): void {
    if (!this.busId.trim()) {
      this.scheduleMessage = this.languageService.translate('routePlanner.busIdRequired');
      return;
    }

    this.updatingSchedule = true;
    this.scheduleMessage = '';

    this.busService.updateBusSchedule(this.busId.trim(), {
      departureTime: this.departureTime || undefined,
      arrivalTime: this.arrivalTime || undefined,
      effectiveDate: this.effectiveDate || undefined,
      note: this.note.trim() || undefined
    }).subscribe({
      next: (res: any) => {
        this.scheduleMessage = this.languageService.translate('routePlanner.updateSuccess', {
          count: res?.notifiedBookings ?? 0
        });
        this.updatingSchedule = false;
      },
      error: (err: any) => {
        console.error('Schedule update failed', err);
        this.scheduleMessage = err?.error?.message || this.languageService.translate('routePlanner.updateFailed');
        this.updatingSchedule = false;
      }
    });
  }

  sendPromotion(): void {
    if (!this.promoTitle.trim() || !this.promoMessage.trim()) {
      this.promoMessageStatus = this.languageService.translate('routePlanner.promoRequired');
      return;
    }

    this.sendingPromo = true;
    this.promoMessageStatus = '';

    this.notificationService.sendPromotion({
      title: this.promoTitle.trim(),
      message: this.promoMessage.trim(),
      offerTitle: this.promoOfferTitle.trim() || undefined,
      channels: {
        inApp: true,
        email: true,
        push: true
      }
    }).subscribe({
      next: (res) => {
        this.promoMessageStatus = this.languageService.translate('routePlanner.promoSuccess', {
          count: res.sentCount
        });
        this.sendingPromo = false;
      },
      error: (err: any) => {
        console.error('Promotion send failed', err);
        this.promoMessageStatus = err?.error?.error || this.languageService.translate('routePlanner.promoFailed');
        this.sendingPromo = false;
      }
    });
  }
}
