import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { LanguageService } from '../i18n/language.service';
import { PostService } from '../service/post.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  isVerifiedUser = false;
  isLoggedIn = false;
  posts: any[] = [];
  newPost = '';
  newPostTitle = '';
  newPostImageUrl = '';
  selectedTopic = 'all';
  readonly topics = [
    { value: 'all', label: 'All Topics' },
    { value: 'routes', label: 'Routes' },
    { value: 'destinations', label: 'Destinations' },
    { value: 'travel-advice', label: 'Travel Advice' },
    { value: 'journey-stories', label: 'Journey Stories' }
  ];
  currentUserId = '';
  currentUserName = 'Traveler';
  communityMessage = '';

  constructor(
    private postService: PostService,
    private languageService: LanguageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.hydrateCurrentUser();
    this.loadPosts();
  }

  private hydrateCurrentUser(): void {
    const user = this.authService.getAuthUser();
    this.isLoggedIn = !!user;
    this.currentUserId = user?._id || '';
    this.currentUserName = String(user?.name || user?.email?.split('@')[0] || 'Traveler');
    this.isVerifiedUser = user ? user['isVerified'] !== false : false;
  }

  loadPosts(): void {
    this.postService.getPosts(this.selectedTopic).subscribe((res: any) => {
      this.posts = Array.isArray(res) ? res : [];
    });
  }

  addPost(): void {
    this.communityMessage = '';

    if (!this.isLoggedIn) {
      this.communityMessage = this.languageService.translate('community.verifiedOnly');
      return;
    }

    if (!this.isVerifiedUser) {
      this.communityMessage = this.languageService.translate('community.verifiedOnly');
      return;
    }

    if (!this.newPost.trim()) {
      this.communityMessage = 'Write something before posting.';
      return;
    }

    const data = {
      title: this.newPostTitle,
      topic: this.selectedTopic === 'all' ? 'travel-advice' : this.selectedTopic,
      content: this.newPost,
      imageUrl: this.newPostImageUrl
    };

    this.postService.addPost(data).subscribe(() => {
      this.newPostTitle = '';
      this.newPost = '';
      this.newPostImageUrl = '';
      this.communityMessage = 'Post shared with the traveler community.';
      this.loadPosts();
    }, (error) => {
      this.communityMessage = error?.error?.error || 'Unable to publish post right now.';
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.newPostImageUrl = typeof reader.result === 'string' ? reader.result : '';
    };
    reader.readAsDataURL(file);
  }

  likePost(post: any): void {
    if (!post?._id) {
      return;
    }

    this.postService.likePost(post._id).subscribe((updatedPost) => {
      this.replacePost(updatedPost);
    });
  }

  reportPost(post: any): void {
    if (!post?._id) {
      return;
    }

    this.postService.reportPost(post._id).subscribe({
      next: (updatedPost) => {
        if (updatedPost?.isHidden) {
          this.communityMessage = this.languageService.translate('community.postRemoved');
          this.posts = this.posts.filter((item) => item._id !== post._id);
          return;
        }

        this.replacePost(updatedPost);
      },
      error: (error) => {
        this.communityMessage = error?.error?.error || 'Unable to report this post again.';
      }
    });
  }

  addComment(post: any): void {
    if (!post.newComment) {
      return;
    }

    this.postService.addComment(post._id, post.newComment).subscribe((updatedPost) => {
      this.replacePost(updatedPost);
    });
  }

  sharePost(post: any): void {
    const shareText = `${post.title ? `${post.title} - ` : ''}${post.content}`;
    const shareData = {
      title: post.title || 'Traveler community post',
      text: shareText,
      url: `${window.location.origin}/community`
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => undefined);
      return;
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareData.url}`)}`, '_blank');
  }

  onTopicChange(topic: string): void {
    this.selectedTopic = topic;
    this.loadPosts();
  }

  private replacePost(updatedPost: any): void {
    this.posts = this.posts.map((post) => {
      if (post._id !== updatedPost._id) {
        return post;
      }

      return {
        ...updatedPost,
        newComment: ''
      };
    });
  }
}
