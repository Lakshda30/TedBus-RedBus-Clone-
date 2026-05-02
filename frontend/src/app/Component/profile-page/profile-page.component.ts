import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../../i18n/language.service';
import { BusService } from '../../service/bus.service';
import { Booking } from '../../model/booking.model';
import { AuthService } from '../../service/auth.service';
import { ReviewItem, ReviewService } from '../../service/review.service';
import { PostService } from '../../service/post.service';

interface ProfileUser {
  _id: string;
  email: string;
  name?: string;
  token?: string;
  phone?: string;
  gender?: string;
}

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  activeTab: string = 'profile';
  selecteditem = 'trips';
  mytrip: Booking[] = [];
  currentemail = '';
  currentname = '';

  get customer() {
    return this.user;
  }
  user: ProfileUser | null = null;
  cancellingBookingId: string | null = null;
  tripMessage = '';
  reviewMessage = '';
  selectedReviewBookingId: string | null = null;
  rating = 5;
  reviewText = '';
  savingReview = false;
  reviewMap: Record<string, ReviewItem | null> = {};
  communityPosts: any[] = [];

  isEditingProfile = false;
  editCustomerData: Partial<ProfileUser> = {};
  savingProfile = false;
  profileMessage = '';

  constructor(
    private busbooking: BusService,
    private router: Router,
    private authService: AuthService,
    private languageService: LanguageService,
    private reviewService: ReviewService,
    private postService: PostService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const user = this.getCurrentUser();

    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.user = user;
    this.currentemail = user.email;
    this.currentname = user.name || '';

    this.getMyBookings();
    this.loadCommunityActivity();
  }

  private getCurrentUser(): ProfileUser | null {
    const authUser = this.authService.getAuthUser();

    if (!authUser || !authUser._id || !authUser.email) {
      return null;
    }

    return {
      _id: authUser._id,
      email: authUser.email,
      name: typeof authUser.name === 'string' ? authUser.name : '',
      token: typeof authUser.token === 'string' ? authUser.token : undefined,
      phone: typeof authUser.phone === 'string' ? authUser.phone : '',
      gender: typeof authUser.gender === 'string' ? authUser.gender : ''
    };
  }

  getMyBookings(): void {
    this.busbooking.getMyBookings().subscribe({
      next: (res: Booking[]) => {
        console.log('Bookings:', res);
        this.mytrip = res;
        this.loadReviewState();
      },
      error: (err: any) => {
        console.error('Booking API error', err);
      }
    });
  }

  loadCommunityActivity(): void {
    if (!this.user?._id) {
      return;
    }

    this.postService.getUserPosts(this.user._id).subscribe({
      next: (posts: any) => {
        this.communityPosts = Array.isArray(posts) ? posts : [];
      },
      error: () => {
        this.communityPosts = [];
      }
    });
  }

  openEditProfile(): void {
    if (this.user) {
      this.isEditingProfile = true;
      this.profileMessage = '';
      this.editCustomerData = {
        name: this.user.name || '',
        phone: this.user.phone || '',
        gender: this.user.gender || ''
      };
    }
  }

  closeEditProfile(): void {
    this.isEditingProfile = false;
  }

  onPhoneInput(event: any): void {
    // Strip non-numeric characters automatically
    let val = event.target.value.replace(/\D/g, '');
    if (val.length > 10) {
      val = val.substring(0, 10);
    }
    this.editCustomerData.phone = val;
    event.target.value = val;
  }

  isProfileValid(): boolean {
    const phone = this.editCustomerData.phone;
    if (phone && phone.trim().length > 0) {
      if (phone.length !== 10 || !/^\d+$/.test(phone)) {
        return false;
      }
    }
    return true;
  }

  saveProfile(): void {
    if (!this.user || !this.user._id) return;

    this.savingProfile = true;
    this.profileMessage = '';
    
    this.http.put<ProfileUser>(`http://localhost:5000/api/customer/${this.user._id}/profile`, this.editCustomerData)
      .subscribe({
        next: (updatedUser) => {
          if (this.user) {
            this.user.name = updatedUser.name;
            this.user.phone = updatedUser.phone;
            this.user.gender = updatedUser.gender;
            
            const currentLocalUserStr = localStorage.getItem('currentUser');
            if (currentLocalUserStr) {
              try {
                const currentLocalUser = JSON.parse(currentLocalUserStr);
                currentLocalUser.name = updatedUser.name;
                currentLocalUser.phone = updatedUser.phone;
                currentLocalUser.gender = updatedUser.gender;
                localStorage.setItem('currentUser', JSON.stringify(currentLocalUser));
              } catch (e) {
                console.error('Error updating local storage', e);
              }
            }
          }
          this.savingProfile = false;
          this.isEditingProfile = false;
        },
        error: (err) => {
          console.error('Failed to update profile', err);
          this.profileMessage = 'Failed to update profile. Please try again.';
          this.savingProfile = false;
        }
      });
  }

  handlelistitemclick(selected: string): void {
    this.selecteditem = selected;
  }

  cancelTrip(booking: Booking): void {
    if (!booking._id || booking.status === 'cancelled') {
      return;
    }

    this.cancellingBookingId = booking._id;
    this.tripMessage = '';

    this.busbooking.cancelBooking(booking._id, 'Cancelled by user').subscribe({
      next: () => {
        this.tripMessage = this.languageService.translate('profile.bookingCancelled');
        this.getMyBookings();
        this.cancellingBookingId = null;
      },
      error: (err: any) => {
        console.error('Cancellation failed', err);
        this.tripMessage = err?.error?.error || this.languageService.translate('profile.cancelFailed');
        this.cancellingBookingId = null;
      }
    });
  }

  loadReviewState(): void {
    this.mytrip
      .filter((trip) => trip._id)
      .forEach((trip) => {
        this.reviewService.checkReviewByBooking(trip._id as string).subscribe({
          next: (review) => {
            this.reviewMap[trip._id as string] = review;
          },
          error: () => {
            this.reviewMap[trip._id as string] = null;
          }
        });
      });
  }

  canReviewTrip(booking: Booking): boolean {
    return String(booking.status).toLowerCase() === 'completed';
  }

  hasReview(booking: Booking): boolean {
    return !!booking._id && !!this.reviewMap[booking._id];
  }

  canEditReview(booking: Booking): boolean {
    if (!booking._id) {
      return false;
    }

    const review = this.reviewMap[booking._id];
    if (!review?.editableUntil) {
      return false;
    }

    return new Date(review.editableUntil).getTime() > Date.now();
  }

  openReviewForm(booking: Booking): void {
    if (!booking._id) {
      return;
    }

    const existingReview = this.reviewMap[booking._id];
    this.selectedReviewBookingId = booking._id;
    this.reviewMessage = '';
    this.rating = existingReview?.rating ?? 5;
    this.reviewText = existingReview?.reviewText ?? '';
  }

  closeReviewForm(): void {
    this.selectedReviewBookingId = null;
    this.rating = 5;
    this.reviewText = '';
  }

  submitReview(booking: Booking): void {
    if (!booking._id || !this.reviewText.trim()) {
      return;
    }

    this.savingReview = true;
    this.reviewMessage = '';

    const existingReview = this.reviewMap[booking._id];
    const payload = {
      rating: this.rating,
      reviewText: this.reviewText.trim()
    };

    const request$ = existingReview
      ? this.reviewService.updateReview(existingReview._id, payload)
      : this.reviewService.submitReview({
          bookingId: booking._id,
          ...payload
        });

    request$.subscribe({
      next: (response) => {
        this.reviewMap[booking._id as string] = response.review;
        this.reviewMessage = existingReview
          ? this.languageService.translate('profile.reviewUpdated')
          : this.languageService.translate('profile.reviewSubmitted');
        this.savingReview = false;
        this.closeReviewForm();
      },
      error: (error) => {
        this.reviewMessage = error?.error?.message || this.languageService.translate('profile.reviewFailed');
        this.savingReview = false;
      }
    });
  }
}
