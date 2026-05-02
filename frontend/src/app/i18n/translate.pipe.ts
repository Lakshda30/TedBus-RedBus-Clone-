import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from './language.service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private languageSubscription: Subscription;

  constructor(
    private languageService: LanguageService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.languageSubscription = this.languageService.currentLanguage$.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  transform(
    key: string,
    params?: Record<string, string | number | null | undefined>
  ): string {
    return this.languageService.translate(key, params);
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }
}
