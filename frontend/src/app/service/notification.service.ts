import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { url } from '../config';
import { firstValueFrom } from 'rxjs';

export interface NotificationItem {
  _id?: string;
  userId: string;
  type?: string;
  title?: string;
  message: string;
  channels?: {
    inApp?: boolean;
    email?: boolean;
    push?: boolean;
  };
  deliveryStatus?: {
    inApp?: string;
    email?: string;
    push?: string;
  };
  retryCount?: number;
  locale?: string;
  metadata?: Record<string, unknown>;
  read?: boolean;
  createdAt?: string;
}

export type NotificationFilter =
  | 'all'
  | 'unread'
  | 'booking_confirmation'
  | 'booking_cancellation'
  | 'schedule_change'
  | 'promotion';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = `${url}api/notifications`;
  private socketUrl = url.replace(/\/$/, '');
  private socket: Socket | null = null;
  private notificationSubject = new Subject<NotificationItem>();
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private vapidPublicKey: string | null = null;

  notifications$ = this.notificationSubject.asObservable();

  constructor(private http: HttpClient) {}

  isBrowserNotificationSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  getBrowserNotificationPermission(): NotificationPermission | 'unsupported' {
    if (!this.isBrowserNotificationSupported()) {
      return 'unsupported';
    }

    return Notification.permission;
  }

  async requestBrowserNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (!this.isBrowserNotificationSupported()) {
      return 'unsupported';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    return Notification.requestPermission();
  }

  async registerNotificationServiceWorker(): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    if (this.serviceWorkerRegistration) {
      return;
    }

    try {
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/assets/notification-sw.js');
    } catch (error) {
      console.error('Notification service worker registration failed', error);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  private async getPushPublicKey(): Promise<string> {
    if (this.vapidPublicKey !== null) {
      return this.vapidPublicKey;
    }

    const response = await firstValueFrom(
      this.http.get<{ publicKey: string }>(`${this.api}/push-public-key`)
    );

    this.vapidPublicKey = response?.publicKey || '';
    return this.vapidPublicKey;
  }

  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.isBrowserNotificationSupported() || !('serviceWorker' in navigator)) {
      return null;
    }

    await this.registerNotificationServiceWorker();

    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      return existingSubscription;
    }

    const publicKey = await this.getPushPublicKey();
    if (!publicKey) {
      return null;
    }

    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(publicKey)
    });
  }

  async unsubscribeFromPushNotifications(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }
  }

  connectSocket(userId: string) {
    if (this.socket) return;
    void this.registerNotificationServiceWorker();
    this.socket = io(this.socketUrl, { path: '/socket.io' });
    this.socket.on('connect', () => {
      this.socket?.emit('join', userId);
    });
    this.socket.on('notification', (data: any) => {
      this.notificationSubject.next(data);
      this.showBrowserNotification(data);
    });
  }

  disconnectSocket() {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
  }

  // ...existing code...
  getNotifications(userId: string): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(`${this.api}/user/${userId}`);
  }

  addNotification(payload: NotificationItem | string): Observable<NotificationItem> {
    const body = typeof payload === 'string'
      ? {
          userId: '',
          type: 'general',
          title: 'Notification',
          message: payload
        }
      : payload;

    return this.http.post<NotificationItem>(this.api, body);
  }

  markAsRead(notification: NotificationItem): Observable<NotificationItem> {
    return this.http.patch<NotificationItem>(`${this.api}/${notification._id}/read`, {});
  }

  markAllAsRead(userId: string): Observable<{ message: string; modifiedCount: number }> {
    return this.http.patch<{ message: string; modifiedCount: number }>(
      `${this.api}/user/${userId}/read-all`,
      {}
    );
  }

  sendPromotion(payload: {
    title: string;
    message: string;
    offerTitle?: string;
    channels?: {
      inApp?: boolean;
      email?: boolean;
      push?: boolean;
    };
  }): Observable<{ message: string; sentCount: number }> {
    return this.http.post<{ message: string; sentCount: number }>(
      `${this.api}/promotion/broadcast`,
      payload
    );
  }

  private showBrowserNotification(notification: NotificationItem): void {
    if (!this.isBrowserNotificationSupported()) {
      return;
    }

    if (Notification.permission !== 'granted') {
      return;
    }

    const shouldShowPush = notification.channels?.push ?? true;
    if (!shouldShowPush) {
      return;
    }

    const title = notification.title || 'New Notification';
    const body = notification.message;
    const tag = notification._id || `${notification.type || 'general'}-${Date.now()}`;
    const isPageHidden = typeof document !== 'undefined' && document.visibilityState !== 'visible';

    if (isPageHidden && 'serviceWorker' in navigator) {
      void navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({
          type: 'SHOW_NOTIFICATION',
          payload: {
            title,
            message: body,
            tag,
            url: '/notifications'
          }
        });
      });
      return;
    }

    const nativeNotification = new Notification(title, {
      body,
      tag
    });

    nativeNotification.onclick = () => {
      window.focus();
      nativeNotification.close();
    };
  }
}
