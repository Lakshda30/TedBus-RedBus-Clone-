import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface ReviewItem {
  _id: string;
  bookingId: string;
  busId: string;
  routeId?: string;
  rating: number;
  reviewText: string;
  helpfulVotes: number;
  reportedCount: number;
  isHidden: boolean;
  editableUntil: string;
  editedAt?: string | null;
  isTrustedReviewer?: boolean;
  createdAt?: string;
}

export interface BusReviewSummary {
  count: number;
  averageRating: number;
  reviews: ReviewItem[];
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly api = 'http://localhost:5000/api/reviews';

  constructor(private http: HttpClient) {}

  submitReview(data: { bookingId: string; rating: number; reviewText: string }): Observable<{ message: string; review: ReviewItem }> {
    return this.http.post<{ message: string; review: ReviewItem }>(this.api, data);
  }

  updateReview(reviewId: string, data: { rating: number; reviewText: string }): Observable<{ message: string; review: ReviewItem }> {
    return this.http.patch<{ message: string; review: ReviewItem }>(`${this.api}/${reviewId}`, data);
  }

  getBusReviewSummary(busId: string): Observable<BusReviewSummary> {
    return this.http.get<BusReviewSummary>(`${this.api}/bus/${busId}`);
  }

  getReviews(busId: string): Observable<ReviewItem[]> {
    return this.getBusReviewSummary(busId).pipe(
      map((response) => response.reviews || [])
    );
  }

  markHelpful(reviewId: string): Observable<{ message: string; review: ReviewItem }> {
    return this.http.post<{ message: string; review: ReviewItem }>(`${this.api}/${reviewId}/helpful`, {});
  }

  reportReview(reviewId: string): Observable<{ message: string; review: ReviewItem }> {
    return this.http.post<{ message: string; review: ReviewItem }>(`${this.api}/${reviewId}/report`, {});
  }

  checkReviewByBooking(bookingId: string): Observable<ReviewItem | null> {
    return this.http.get<ReviewItem | null>(`${this.api}/booking/${bookingId}`);
  }
}

