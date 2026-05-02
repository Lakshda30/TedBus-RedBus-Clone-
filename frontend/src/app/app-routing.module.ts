import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './Component/landing-page/landing-page.component';
import { SelectbusPageComponent } from './Component/selectbus-page/selectbus-page.component';
import { PaymentPageComponent } from './Component/payment-page/payment-page.component';
import { ProfilePageComponent } from './Component/profile-page/profile-page.component';
import { AuthGuard } from './auth.guard';
import { SeatLayoutComponent } from './Component/seat-layout/seat-layout.component';
import { BookingSuccessComponent } from './booking-success/booking-success.component';
import { PassengerDetailsComponent } from './passenger-details/passenger-details.component';
import { CommunityComponent } from './community/community.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RoutePlannerComponent } from './route-planner/route-planner.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';

const routes: Routes = [
  {path: '',component:LandingPageComponent},
  {path: 'select-bus',component:SelectbusPageComponent},
  {path:'payment',component:PaymentPageComponent},
  {path:'profile',component:ProfilePageComponent, canActivate: [AuthGuard]},
  {path: 'seat-layout/:busId',component: SeatLayoutComponent},
  {path:'booking-success',component: BookingSuccessComponent},
  {path:'passenger-details', component: PassengerDetailsComponent },
  { path: 'community', component: CommunityComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'settings/notifications', component: NotificationSettingsComponent },
  {path: 'route-planner',component: RoutePlannerComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
