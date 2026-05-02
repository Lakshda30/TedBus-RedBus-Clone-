import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../i18n/language.service';
import { SupportedLanguage } from '../../i18n/translations';
import { AuthService } from '../../service/auth.service';
import { CustomerService } from '../../service/customer.service';
import { NotificationItem, NotificationService } from '../../service/notification.service';

declare global {
  interface Window {
    google: any;
  }
}

interface NavItem {
  kind: 'bus' | 'cab' | 'train' | 'link';
  labelKey: string;
  route?: string;
  iconClass?: string;
  accentClass?: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('googleButtonHost') googleButtonHost?: ElementRef<HTMLDivElement>;
  private readonly lastSearchStorageKey = 'last_bus_search';

  isloggedIn = false;
  notifications: NotificationItem[] = [];
  showNotifications = false;
  unreadCount = 0;
  currentLang: SupportedLanguage = 'en';
  readonly supportedLanguages = this.languageService.supportedLanguages;
  readonly productLinks: NavItem[] = [
    { kind: 'bus', labelKey: 'navbar.busTickets', route: '/', iconClass: 'fa-solid fa-bus', accentClass: 'accent-bus' },
    { kind: 'cab', labelKey: 'navbar.cabRental', route: '/route-planner', iconClass: 'fa-solid fa-taxi', accentClass: 'accent-cab' },
    { kind: 'train', labelKey: 'navbar.trainTickets', route: '/', iconClass: 'fa-solid fa-train-subway', accentClass: 'accent-train' }
  ];
  readonly utilityLinks: NavItem[] = [
    { kind: 'link', labelKey: 'navbar.notifications', route: '/notifications', iconClass: 'fa-regular fa-bell' },
    { kind: 'link', labelKey: 'navbar.routePlanner', route: '/route-planner', iconClass: 'fa-solid fa-route' }
  ];

  userName = '';
  googleLoginReady = false;
  googleLoginError = '';
  isDarkMode = false;

  private userId: string | null = null;
  private subs: Subscription[] = [];
  private googleClientId = '';

  constructor(
    private router: Router,
    private customerservice: CustomerService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.isloggedIn = this.authService.isLoggedIn();
    this.currentLang = this.languageService.getCurrentLanguage();
    this.isDarkMode = document.body.classList.contains('dark-mode');
    this.userName = this.authService.getAuthUser()?.name || this.authService.getAuthUser()?.email?.split('@')[0] || '';
    this.googleClientId = this.readGoogleClientId();

    this.subs.push(
      this.languageService.currentLanguage$.subscribe((language) => {
        this.currentLang = language;
      })
    );

    if (this.userId) {
      this.connectNotificationStreams(this.userId);
    }
  }

  ngAfterViewInit(): void {
    this.renderGoogleButton();
  }

  private connectNotificationStreams(userId: string): void {
    this.notificationService.connectSocket(userId);

    this.subs.push(
      this.notificationService.getNotifications(userId).subscribe({
        next: (notifs: NotificationItem[]) => {
          this.notifications = notifs || [];
          this.unreadCount = this.notifications.filter((notification) => !notification.read).length;
        },
        error: (err) => console.error('Error loading notifications', err)
      })
    );

    this.subs.push(
      this.notificationService.notifications$.subscribe((notif: NotificationItem | null) => {
        if (!notif) {
          return;
        }

        this.notifications.unshift(notif);
        this.unreadCount++;
      })
    );
  }

  private readGoogleClientId(): string {
    const meta = document.querySelector('meta[name="google-signin-client_id"]') as HTMLMetaElement | null;
    const clientId = meta?.content?.trim() || '';
    const placeholderClientIds = ['YOUR_GOOGLE_CLIENT_ID'];

    return placeholderClientIds.some((placeholder) => clientId.includes(placeholder)) ? '' : clientId;
  }

  private renderGoogleButton(): void {
    if (this.isloggedIn) {
      return;
    }

    if (!window.google?.accounts?.id) {
      this.googleLoginError = this.languageService.translate('navbar.googleScriptUnavailable');
      return;
    }

    if (!this.googleClientId) {
      this.googleLoginError = this.languageService.translate('navbar.googleClientIdMissing', {
        origin: window.location.origin
      });
      return;
    }

    if (!this.googleButtonHost?.nativeElement) {
      return;
    }

    this.googleButtonHost.nativeElement.innerHTML = '';

    window.google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: (response: { credential: string }) => this.handlelogin(response),
      auto_select: false,
      cancel_on_tap_outside: true
    });

    window.google.accounts.id.renderButton(this.googleButtonHost.nativeElement, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: 'signin_with',
      width: 240
    });

    this.googleLoginReady = true;
    this.googleLoginError = '';
  }

  toggleTheme(): void {
    document.body.classList.toggle('dark-mode');
    this.isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(notification: NotificationItem): void {
    if (!notification.read) {
      notification.read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    }

    this.notificationService.markAsRead(notification).subscribe({
      error: (err) => console.error(err)
    });
  }

  handlelogin(response: { credential: string }): void {
    this.customerservice.login({
      email: '',
      credential: response.credential,
      clientId: this.googleClientId
    }).subscribe({
      next: (res: any) => {
        this.authService.storeAuthUser(res);
        this.languageService.setLanguage(res?.language || this.currentLang, false);
        this.userId = this.authService.getUserId();
        this.userName = res?.name || res?.email?.split('@')[0] || '';
        this.isloggedIn = true;
        this.googleLoginReady = false;
        this.googleLoginError = '';
        if (this.userId) {
          this.connectNotificationStreams(this.userId);
        }
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.googleLoginError = err?.error?.error || err?.error?.message || this.languageService.translate('navbar.loginFailed');
        console.error('Login failed:', err);
      }
    });
  }

  handlelogout(): void {
    this.authService.clearAuthUser();
    this.isloggedIn = false;
    this.userId = null;
    this.userName = '';
    this.notifications = [];
    this.unreadCount = 0;
    this.showNotifications = false;
    this.notificationService.disconnectSocket();
    this.router.navigate(['/']);
    setTimeout(() => this.renderGoogleButton(), 0);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  navigateProduct(item: NavItem): void {
    if (item.kind === 'bus') {
      const currentUrl = this.router.parseUrl(this.router.url);
      const currentQuery = currentUrl.queryParams || {};

      if (currentUrl.root.children['primary']?.segments?.map((segment) => segment.path).join('/') === 'select-bus' && currentQuery['departure']) {
        this.router.navigate(['/select-bus'], { queryParams: currentQuery });
        return;
      }

      const storedSearch = localStorage.getItem(this.lastSearchStorageKey);
      if (storedSearch) {
        try {
          const parsed = JSON.parse(storedSearch);
          if (parsed?.departure && parsed?.arrival && parsed?.date) {
            this.router.navigate(['/select-bus'], { queryParams: parsed });
            return;
          }
        } catch {
          // ignore invalid cached search
        }
      }
    }

    this.router.navigate([item.route || '/']);
  }

  changeLanguage(language: string): void {
    this.languageService.setLanguage(language);
  }

  getNotificationPreview(notification: NotificationItem): string {
    return notification.title || notification.message;
  }

  trackByLabel(_index: number, item: NavItem): string {
    return item.labelKey;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.notification-center')) {
      this.showNotifications = false;
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription) => subscription.unsubscribe());
    this.notificationService.disconnectSocket();
  }
}
