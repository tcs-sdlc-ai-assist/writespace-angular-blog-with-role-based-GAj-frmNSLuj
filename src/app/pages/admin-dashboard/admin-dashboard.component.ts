import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { BlogCardComponent } from '../../components/blog-card/blog-card.component';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import type { Post } from '../../models/post.model';
import type { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, StatCardComponent, BlogCardComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalPosts: number = 0;
  totalUsers: number = 0;
  totalAdmins: number = 0;
  totalRegularUsers: number = 0;
  totalComments: number = 0;
  totalViews: number = 0;

  recentPosts: Post[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  private currentUserId: string = '';

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const session = this.authService.getSession();
    if (!session || session.role !== 'admin') {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUserId = session.userId;
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const users: User[] = this.storageService.getUsers();
      const posts: Post[] = this.storageService.getPosts();

      this.totalPosts = posts.length;
      this.totalUsers = users.length;
      this.totalAdmins = users.filter((u: User) => u.role === 'admin').length;
      this.totalRegularUsers = users.filter((u: User) => u.role === 'user').length;
      this.totalComments = 0;
      this.totalViews = 0;

      this.loadRecentPosts();
    } catch {
      this.errorMessage = 'Failed to load dashboard data. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  loadRecentPosts(): void {
    try {
      const posts: Post[] = this.storageService.getPosts();
      this.recentPosts = posts
        .sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      this.errorMessage = '';
    } catch {
      this.errorMessage = 'Failed to load recent posts.';
    }
  }

  onEditPost(postId: string): void {
    this.router.navigate(['/write', postId]);
  }

  onDeletePost(postId: string): void {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) {
      return;
    }

    try {
      const posts: Post[] = this.storageService.getPosts();
      const updatedPosts = posts.filter((p: Post) => p.id !== postId);
      this.storageService.savePosts(updatedPosts);
      this.loadDashboardData();
    } catch {
      this.errorMessage = 'Failed to delete post. Please try again.';
    }
  }

  isPostOwner(post: Post): boolean {
    return post.authorId === this.currentUserId;
  }
}