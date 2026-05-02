import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../service/booking.service';
import { Router } from '@angular/router';
import { ReviewItem, ReviewService } from '../../service/review.service';
import { NotificationService } from '../../service/notification.service';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-seat-layout',
  templateUrl: './seat-layout.component.html',
  styleUrls: ['./seat-layout.component.css']
})
export class SeatLayoutComponent implements OnInit {
  seats: number[] = Array.from({ length: 40 }, (_, i) => i + 1);
  selectedSeats: number[] = [];
  bookedSeats: number[] = [];
  pricePerSeat = 300;
  busId: string | null = null;
  reviews: ReviewItem[] = [];
  averageRating = 0;
  reviewInfoMessage = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router,
    private reviewService: ReviewService,
    private notificationService: NotificationService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.busId = this.route.snapshot.paramMap.get('busId');
    this.loadReviews();
  }

  loadReviews(): void {
    if (!this.busId) {
      return;
    }

    this.reviewService.getBusReviewSummary(this.busId).subscribe({
      next: (summary) => {
        this.reviews = summary.reviews || [];
        this.averageRating = summary.averageRating || 0;
      },
      error: (error) => {
        console.error('Failed to load reviews', error);
      }
    });
  }

  likeReview(review: ReviewItem): void {
    this.reviewService.markHelpful(review._id).subscribe({
      next: (response) => {
        review.helpfulVotes = response.review.helpfulVotes;
        review.isTrustedReviewer = response.review.helpfulVotes >= 3;
      },
      error: (error) => {
        alert(error?.error?.message || this.languageService.translate('seatLayout.helpfulFailed'));
      }
    });
  }

  reportReview(review: ReviewItem): void {
    this.reviewService.reportReview(review._id).subscribe({
      next: (response) => {
        if (response.review.isHidden) {
          alert(this.languageService.translate('seatLayout.reviewHidden'));
          this.loadReviews();
          return;
        }

        review.reportedCount = response.review.reportedCount;
      },
      error: (error) => {
        alert(error?.error?.message || this.languageService.translate('seatLayout.reportFailed'));
      }
    });
  }

  isTopReviewer(review: ReviewItem): boolean {
    return !!review.isTrustedReviewer || (review.helpfulVotes || 0) >= 3;
  }

  toggleSeat(seat: number): void {
    if (this.bookedSeats.includes(seat)) {
      return;
    }

    if (this.selectedSeats.includes(seat)) {
      this.selectedSeats = this.selectedSeats.filter((selectedSeat) => selectedSeat !== seat);
    } else {
      this.selectedSeats.push(seat);
    }
  }

  getTotalPrice(): number {
    return this.selectedSeats.length * this.pricePerSeat;
  }

  bookSeats(): void {
    if (this.selectedSeats.length === 0) {
      alert(this.languageService.translate('seatLayout.selectSeatsFirst'));
      return;
    }

    if (!this.busId) {
      return;
    }

    const data = {
      busId: this.busId,
      seats: this.selectedSeats,
      total: this.getTotalPrice()
    };

    localStorage.setItem('bookingData', JSON.stringify(data));
    this.router.navigate(['/payment']);

    this.notificationService.addNotification({
      userId: this.busId,
      type: 'booking_confirmation',
      title: this.languageService.translate('seatLayout.bookingConfirmed'),
      message: this.languageService.translate('seatLayout.bookingConfirmedMessage'),
      channels: {
        inApp: true,
        email: false,
        push: false
      },
      locale: this.languageService.getCurrentLanguage(),
      metadata: {
        busId: this.busId,
        seats: this.selectedSeats
      }
    }).subscribe();
  }

  submitReview(): void {
    alert(this.languageService.translate('seatLayout.reviewFromTrips'));
  }
}
