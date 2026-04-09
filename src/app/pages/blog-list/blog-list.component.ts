import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BlogCardComponent } from '../../components/blog-card/blog-card.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import type { Post } from '../../models/post.model';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, BlogCardComponent, NavbarComponent],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  blogs: Post[] = [];
  currentUserId: string = '';
  isAdmin: boolean = false;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const session: Session | null = this.authService.getSession();
    if (session) {
      this.currentUserId = session.userId;
      this.isAdmin = session.role === 'admin';
    }

    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.errorMessage = '';

    try {
      const posts = this.storageService.getPosts();
      this.blogs = posts.sort((a: Post, b: Post) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      this.loading = false;
    } catch {
      this.errorMessage = 'Failed to load blog posts. Please try again.';
      this.loading = false;
    }
  }

  isOwner(post: Post): boolean {
    return this.isAdmin || post.authorId === this.currentUserId;
  }

  onEdit(postId: string): void {
    this.router.navigate(['/write', postId]);
  }

  onDelete(postId: string): void {
    const post = this.blogs.find((p: Post) => p.id === postId);
    if (!post) {
      return;
    }

    if (!this.isAdmin && post.authorId !== this.currentUserId) {
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) {
      return;
    }

    const updatedPosts = this.blogs.filter((p: Post) => p.id !== postId);
    this.storageService.savePosts(updatedPosts);
    this.blogs = updatedPosts;
  }
}