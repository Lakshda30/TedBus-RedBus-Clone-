import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { LanguageService } from '../../i18n/language.service';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  private readonly lastSearchStorageKey = 'last_bus_search';
  fromoption = '';
  tooption = '';
  date = '';
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private languageService: LanguageService
  ) {}

  fromEvent(option: string) {
    this.fromoption = option;
  }

  toEvent(option: string) {
    this.tooption = option;
  }

  matchDate(event: { value?: Date | null }): void {
    if (event.value) {
      const date = new Date(event.value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      this.date = `${year}-${month}-${day}`;
    } else {
      this.date = 'null';
    }
  }

  submit(): void {
    if (this.fromoption && this.tooption && this.date) {
      const hasSupportedRoute =
        (this.fromoption === 'Delhi' && this.tooption === 'Jaipur') ||
        (this.fromoption === 'Mumbai' && this.tooption === 'Goa') ||
        (this.fromoption === 'Bangalore' && this.tooption === 'Mysore') ||
        (this.fromoption === 'Kolkata' && this.tooption === 'Darjeeling') ||
        (this.fromoption === 'Chennai' && this.tooption === 'Pondicherry');

      if (hasSupportedRoute) {
        const searchQuery = {
          departure: this.fromoption,
          arrival: this.tooption,
          date: this.date
        };

        localStorage.setItem(this.lastSearchStorageKey, JSON.stringify(searchQuery));
        this.router.navigate(['/select-bus'],{
          queryParams: searchQuery
        });
      } else {
        const dialogRef = this.dialog.open(DialogComponent);

        dialogRef.afterClosed().subscribe();
      }
    } else {
      alert(this.languageService.translate('landing.fillDetails'));
    }
  }
}
