import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  api = 'http://localhost:5000/api/customer';

  constructor(private http: HttpClient) {}

  addcustomermongo(payload: any) {
    throw new Error('Method not implemented.');
  }

  getCustomer(id: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  updateCustomer(id: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, payload);
  }

  updateNotificationPreferences(
    id: string,
    payload: { email: boolean; push: boolean; promos: boolean; language: string }
  ): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}/notification-preferences`, payload);
  }

  updatePushSubscription(id: string, subscription: PushSubscription | null): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}/push-subscription`, {
      subscription
    });
  }

  updateLanguagePreference(id: string, language: string): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}/language`, { language });
  }

  login(payload: {
    email: string;
    name?: string;
    picture?: string;
    googleId?: string;
    emailVerified?: boolean;
    credential?: string;
    clientId?: string;
  }): Observable<any> {
    return this.http.post<any>('http://localhost:5000/api/customer/login', payload);
  }
}
