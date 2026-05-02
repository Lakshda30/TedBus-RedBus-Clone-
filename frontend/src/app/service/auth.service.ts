import { Injectable } from '@angular/core';

export interface AuthUser {
  _id: string;
  email: string;
  name?: string;
  token?: string;
  language?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageKey = 'Loggedinuser';
  private userIdKey = 'userId';

  getAuthUser(): AuthUser | null {
    const stored = sessionStorage.getItem(this.storageKey);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  }

  storeAuthUser(user: AuthUser): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(user));
    if (user?._id) {
      localStorage.setItem(this.userIdKey, user._id);
    }
  }

  updateAuthUser(patch: Partial<AuthUser>): void {
    const existingUser = this.getAuthUser();
    if (!existingUser) {
      return;
    }

    this.storeAuthUser({
      ...existingUser,
      ...patch
    });
  }

  clearAuthUser(): void {
    sessionStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.userIdKey);
  }

  getToken(): string | null {
    return this.getAuthUser()?.token || null;
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey) || this.getAuthUser()?._id || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
