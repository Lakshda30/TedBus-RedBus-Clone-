import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly api = 'http://localhost:5000/api/posts';

  constructor(private http: HttpClient) {}

  addPost(data: any): Observable<any> {
    return this.http.post(`${this.api}/add-post`, data);
  }

  getPosts(topic = 'all'): Observable<any> {
    return this.http.get(`${this.api}/get-posts`, {
      params: {
        topic
      }
    });
  }

  getUserPosts(userId: string): Observable<any> {
    return this.http.get(`${this.api}/user/${userId}`);
  }

  likePost(id: string): Observable<any> {
    return this.http.post(`${this.api}/like/${id}`, {});
  }

  addComment(id: string, comment: string): Observable<any> {
    return this.http.post(`${this.api}/comment/${id}`, { comment });
  }

  reportPost(id: string): Observable<any> {
    return this.http.post(`${this.api}/report/${id}`, {});
  }

}
