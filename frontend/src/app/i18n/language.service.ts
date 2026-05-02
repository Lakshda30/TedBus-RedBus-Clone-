import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { CustomerService } from '../service/customer.service';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  TRANSLATIONS
} from './translations';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly storageKey = 'app_language';
  private readonly languageSubject = new BehaviorSubject<SupportedLanguage>(DEFAULT_LANGUAGE);

  readonly currentLanguage$ = this.languageSubject.asObservable();
  readonly supportedLanguages = SUPPORTED_LANGUAGES;

  constructor(
    private authService: AuthService,
    private customerService: CustomerService
  ) {}

  async initializeLanguage(): Promise<void> {
    const authLanguage = this.normalizeLanguage(this.authService.getAuthUser()?.language);
    const storedLanguage = this.getStoredLanguage();

    this.applyLanguage(authLanguage ?? storedLanguage ?? DEFAULT_LANGUAGE);

    if (authLanguage) {
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      return;
    }

    try {
      const customer = await firstValueFrom(this.customerService.getCustomer(userId));
      const customerLanguage = this.normalizeLanguage(customer?.language);
      if (customerLanguage) {
        this.applyLanguage(customerLanguage);
        this.authService.updateAuthUser({ language: customerLanguage });
      }
    } catch (error) {
      console.error('Unable to hydrate language from customer profile', error);
    }
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.languageSubject.value;
  }

  setLanguage(language: string, persistToServer = true): void {
    const normalizedLanguage = this.normalizeLanguage(language) ?? DEFAULT_LANGUAGE;
    this.applyLanguage(normalizedLanguage);

    if (!persistToServer) {
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      return;
    }

    this.customerService.updateLanguagePreference(userId, normalizedLanguage).subscribe({
      next: () => {
        this.authService.updateAuthUser({ language: normalizedLanguage });
      },
      error: (error) => {
        console.error('Unable to persist language preference', error);
      }
    });
  }

  translate(key: string, params?: Record<string, string | number | null | undefined>): string {
    const activeLanguage = this.getCurrentLanguage();
    const activeValue = this.lookupTranslation(TRANSLATIONS[activeLanguage], key);
    const fallbackValue = this.lookupTranslation(TRANSLATIONS[DEFAULT_LANGUAGE], key);
    const value = typeof activeValue === 'string'
      ? activeValue
      : typeof fallbackValue === 'string'
        ? fallbackValue
        : key;

    return this.interpolate(value, params);
  }

  private applyLanguage(language: SupportedLanguage): void {
    this.languageSubject.next(language);
    localStorage.setItem(this.storageKey, language);
    document.documentElement.lang = language;
    this.authService.updateAuthUser({ language });
  }

  private getStoredLanguage(): SupportedLanguage | null {
    return this.normalizeLanguage(localStorage.getItem(this.storageKey));
  }

  private normalizeLanguage(language: unknown): SupportedLanguage | null {
    if (typeof language !== 'string') {
      return null;
    }

    return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)
      ? (language as SupportedLanguage)
      : null;
  }

  private lookupTranslation(source: Record<string, unknown>, key: string): unknown {
    return key.split('.').reduce<unknown>((currentValue, currentKey) => {
      if (!currentValue || typeof currentValue !== 'object' || !(currentKey in currentValue)) {
        return undefined;
      }

      return (currentValue as Record<string, unknown>)[currentKey];
    }, source);
  }

  private interpolate(template: string, params?: Record<string, string | number | null | undefined>): string {
    if (!params) {
      return template;
    }

    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
      const value = params[key];
      return value === undefined || value === null ? '' : String(value);
    });
  }
}
