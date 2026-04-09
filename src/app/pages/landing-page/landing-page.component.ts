import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicNavbarComponent } from '../../components/public-navbar/public-navbar.component';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import type { Post } from '../../models/post.model';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PublicNavbarComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  latestPosts: Post[] = [];
  isLoading: boolean = true;
  currentYear: number = new Date().getFullYear();

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLatestPosts();
  }

  private loadLatestPosts(): void {
    this.isLoading = true;
    try {
      const allPosts = this.storageService.getPosts();
      const sorted = allPosts.sort((a: Post, b: Post) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      this.latestPosts = sorted.slice(0, 3);
    } catch {
      this.latestPosts = [];
    }
    this.isLoading = false;
  }

  onPostClick(postId: string): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/posts', postId]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  getExcerpt(content: string): string {
    if (!content) {
      return '';
    }
    const maxLength = 120;
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength).trimEnd() + '...';
  }

  getAuthorInitial(authorName: string): string {
    if (!authorName) {
      return '?';
    }
    return authorName.charAt(0).toUpperCase();
  }

  formatDate(dateString: string): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}