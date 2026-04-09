import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import type { Post } from '../../models/post.model';

@Component({
  selector: 'app-read-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, AvatarComponent],
  templateUrl: './read-blog.component.html',
  styleUrls: ['./read-blog.component.css']
})
export class ReadBlogComponent implements OnInit {
  post: Post | null = null;
  loading: boolean = true;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      this.error = true;
      return;
    }

    const posts = this.storageService.getPosts();
    const found = posts.find((p: Post) => p.id === id);

    if (found) {
      this.post = found;
      this.loading = false;
      this.error = false;
    } else {
      this.post = null;
      this.loading = false;
      this.error = true;
    }
  }

  get authorInitial(): string {
    if (!this.post?.authorName) {
      return '?';
    }
    return this.post.authorName.charAt(0).toUpperCase();
  }

  get formattedDate(): string {
    if (!this.post?.createdAt) {
      return '';
    }
    const date = new Date(this.post.createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  get sanitizedContent(): string {
    if (!this.post?.content) {
      return '';
    }
    return this.post.content;
  }

  goBack(): void {
    this.router.navigate(['/blogs']);
  }
}