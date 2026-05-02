import { Component, OnInit, OnDestroy } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import {
  NotificationFilter,
  NotificationItem,
  NotificationService
} from '../service/notification.service';
import { AuthService } from '../service/auth.service';
import { LanguageService } from '../i18n/language.service';
import { CustomerService } from '../service/customer.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  // ── Notifications ────────────────────────────────────────────
  notifications: NotificationItem[] = [];
  activeFilter: NotificationFilter = 'all';
  pageMessage = '';
  userId: string | null = null;
  filterOptions: Array<{ key: NotificationFilter; labelKey: string }> = [
    { key: 'all',                  labelKey: 'common.all' },
    { key: 'unread',               labelKey: 'common.unread' },
    { key: 'booking_confirmation', labelKey: 'common.booking' },
    { key: 'booking_cancellation', labelKey: 'common.cancellation' },
    { key: 'schedule_change',      labelKey: 'common.scheduleChange' },
    { key: 'promotion',            labelKey: 'common.promotions' }
  ];
  private subs: Subscription[] = [];

  // ── Settings panel ───────────────────────────────────────────
  showSettings = false;
  settingsEmail = true;
  settingsPush = true;
  settingsPromos = false;
  settingsLanguage = 'en';
  settingsMessage = '';
  settingsLoading = false;
  settingsSaving = false;
  settingsPushPermission: NotificationPermission | 'unsupported' = 'unsupported';

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private languageService: LanguageService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (!this.userId) return;

    this.settingsPushPermission = this.notificationService.getBrowserNotificationPermission();
    this.notificationService.connectSocket(this.userId);

    this.subs.push(
      this.notificationService.getNotifications(this.userId).subscribe((res) => {
        this.notifications = res || [];
      })
    );

    this.subs.push(
      this.notificationService.notifications$.subscribe((notif) => {
        if (notif) this.notifications.unshift(notif);
      })
    );
  }

  // ── Notification list ─────────────────────────────────────────
  get filteredNotifications(): NotificationItem[] {
    if (this.activeFilter === 'all')    return this.notifications;
    if (this.activeFilter === 'unread') return this.notifications.filter(n => !n.read);
    return this.notifications.filter(n => n.type === this.activeFilter);
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  setFilter(filter: NotificationFilter): void { this.activeFilter = filter; }

  markRead(notification: NotificationItem): void {
    this.notificationService.markAsRead(notification).subscribe(() => { notification.read = true; });
  }

  markAllAsRead(): void {
    if (!this.userId || this.unreadCount === 0) return;
    this.notificationService.markAllAsRead(this.userId).subscribe({
      next: () => {
        this.notifications = this.notifications.map(n => ({ ...n, read: true }));
        this.pageMessage = this.languageService.translate('notificationsPage.allReadSuccess');
      },
      error: () => {
        this.pageMessage = this.languageService.translate('notificationsPage.allReadError');
      }
    });
  }

  getTypeLabel(type?: string): string {
    switch (type) {
      case 'booking_confirmation': return this.languageService.translate('common.booking');
      case 'booking_cancellation': return this.languageService.translate('common.cancellation');
      case 'schedule_change':      return this.languageService.translate('common.scheduleChange');
      case 'promotion':            return this.languageService.translate('common.promotions');
      default:                     return this.languageService.translate('common.general');
    }
  }

  // ── Settings panel ────────────────────────────────────────────
  toggleSettings(): void {
    this.showSettings = !this.showSettings;
    if (this.showSettings && !this.settingsLoading) {
      this.loadSettings();
    }
  }

  loadSettings(): void {
    if (!this.userId) return;
    this.settingsLoading = true;
    this.settingsMessage = '';

    this.customerService.getCustomer(this.userId).subscribe({
      next: (customer) => {
        const prefs = customer?.notificationPreferences ?? {};
        this.settingsEmail    = prefs.email  ?? true;
        this.settingsPush     = prefs.push   ?? true;
        this.settingsPromos   = prefs.promos ?? false;
        this.settingsLanguage = customer?.language ?? 'en';
        this.settingsLoading  = false;
      },
      error: () => {
        this.settingsMessage = this.languageService.translate('notificationSettings.loadFailed');
        this.settingsLoading = false;
      }
    });
  }

  getSettingsPushLabel(): string {
    const status = this.settingsPushPermission === 'unsupported'
      ? this.languageService.translate('common.unsupported')
      : this.settingsPushPermission;
    return this.languageService.translate('notificationSettings.browserPushStatus', { status });
  }

  async saveSettings(): Promise<void> {
    if (!this.userId) {
      this.settingsMessage = this.languageService.translate('notificationSettings.userNotLoggedIn');
      return;
    }

    if (this.settingsPush) {
      this.settingsPushPermission = await this.notificationService.requestBrowserNotificationPermission();
      if (this.settingsPushPermission !== 'granted') {
        this.settingsMessage = this.languageService.translate('notificationSettings.pushPermissionRequired');
        return;
      }
    }

    const userId = this.userId;
    this.settingsSaving = true;
    this.settingsMessage = '';

    this.customerService.updateNotificationPreferences(userId, {
      email:    this.settingsEmail,
      push:     this.settingsPush,
      promos:   this.settingsPromos,
      language: this.settingsLanguage
    }).subscribe({
      next: async () => {
        this.settingsSaving = false;
        this.languageService.setLanguage(this.settingsLanguage, false);
        this.settingsMessage = this.languageService.translate('notificationSettings.saveSuccess');
        this.settingsPushPermission = this.notificationService.getBrowserNotificationPermission();

        if (this.settingsPush) {
          const subscription = await this.notificationService.subscribeToPushNotifications();
          if (!subscription) {
            this.settingsMessage = this.languageService.translate('notificationSettings.pushSubscriptionFailed');
            return;
          }
          await firstValueFrom(this.customerService.updatePushSubscription(userId, subscription));
          this.notificationService.connectSocket(userId);
        } else {
          await this.notificationService.unsubscribeFromPushNotifications();
          await firstValueFrom(this.customerService.updatePushSubscription(userId, null));
          this.notificationService.disconnectSocket();
        }
      },
      error: () => {
        this.settingsSaving = false;
        this.settingsMessage = this.languageService.translate('notificationSettings.saveFailed');
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.notificationService.disconnectSocket();
  }
}
