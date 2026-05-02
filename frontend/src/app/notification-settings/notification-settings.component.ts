import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LanguageService } from '../i18n/language.service';
import { AuthService } from '../service/auth.service';
import { CustomerService } from '../service/customer.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.css']
})
export class NotificationSettingsComponent implements OnInit {
  email = true;
  push = true;
  promos = false;
  language = 'en';
  message = '';
  loading = false;
  saving = false;
  userId: string | null = null;
  pushPermission: NotificationPermission | 'unsupported' = 'unsupported';

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private notificationService: NotificationService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.pushPermission = this.notificationService.getBrowserNotificationPermission();
    if (!this.userId) {
      this.message = this.languageService.translate('notificationSettings.userNotLoggedIn');
      return;
    }

    this.loadSettings();
  }

  loadSettings(): void {
    if (!this.userId) {
      return;
    }

    const userId = this.userId;
    this.loading = true;
    this.message = '';

    this.customerService.getCustomer(userId).subscribe({
      next: (customer) => {
        const prefs = customer?.notificationPreferences ?? {};
        this.email = prefs.email ?? true;
        this.push = prefs.push ?? true;
        this.promos = prefs.promos ?? false;
        this.language = customer?.language ?? 'en';
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading settings:', err);
        this.message = this.languageService.translate('notificationSettings.loadFailed');
        this.loading = false;
      }
    });
  }

  async save(): Promise<void> {
    if (!this.userId) {
      this.message = this.languageService.translate('notificationSettings.userNotLoggedIn');
      return;
    }

    if (this.push) {
      this.pushPermission = await this.notificationService.requestBrowserNotificationPermission();

      if (this.pushPermission !== 'granted') {
        this.message = this.languageService.translate('notificationSettings.pushPermissionRequired');
        return;
      }
    }

    const userId = this.userId;
    this.saving = true;
    this.message = '';

    const payload = {
      email: this.email,
      push: this.push,
      promos: this.promos,
      language: this.language
    };

    this.customerService.updateNotificationPreferences(userId, payload).subscribe({
      next: async () => {
        this.saving = false;
        this.languageService.setLanguage(this.language, false);
        this.message = this.languageService.translate('notificationSettings.saveSuccess');
        this.pushPermission = this.notificationService.getBrowserNotificationPermission();

        if (this.push) {
          const subscription = await this.notificationService.subscribeToPushNotifications();
          if (!subscription) {
            this.message = this.languageService.translate('notificationSettings.pushSubscriptionFailed');
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
      error: (err) => {
        console.error('Error saving settings:', err);
        this.saving = false;
        this.message = this.languageService.translate('notificationSettings.saveFailed');
      }
    });
  }

  getPushPermissionLabel(): string {
    const status = this.pushPermission === 'unsupported'
      ? this.languageService.translate('common.unsupported')
      : this.pushPermission;

    return this.languageService.translate('notificationSettings.browserPushStatus', { status });
  }
}
