import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import type { Post } from '../../models/post.model';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-write-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './write-blog.component.html',
  styleUrls: ['./write-blog.component.css']
})
export class WriteBlogComponent implements OnInit {
  blogForm!: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  maxContentLength: number = 5000;
  private editPostId: string = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const session = this.authService.getSession();
    if (!session) {
      this.router.navigate(['/login']);
      return;
    }

    this.blogForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      content: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(this.maxContentLength)
      ])
    });

    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.isEditMode = true;
      this.editPostId = postId;
      this.loadPost(postId, session);
    }
  }

  get contentCharCount(): number {
    const content = this.blogForm?.get('content')?.value;
    return content ? content.length : 0;
  }

  private loadPost(postId: string, session: Session): void {
    const posts = this.storageService.getPosts();
    const post = posts.find((p: Post) => p.id === postId);

    if (!post) {
      this.router.navigate(['/blogs']);
      return;
    }

    const isOwner = post.authorId === session.userId;
    const isAdmin = session.role === 'admin';

    if (!isOwner && !isAdmin) {
      this.router.navigate(['/blogs']);
      return;
    }

    this.blogForm.patchValue({
      title: post.title,
      content: post.content
    });
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    const session = this.authService.getSession();
    if (!session) {
      this.router.navigate(['/login']);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const title = this.blogForm.get('title')?.value?.trim();
    const content = this.blogForm.get('content')?.value?.trim();

    try {
      const posts = this.storageService.getPosts();

      if (this.isEditMode) {
        const postIndex = posts.findIndex((p: Post) => p.id === this.editPostId);

        if (postIndex === -1) {
          this.errorMessage = 'Post not found. It may have been deleted.';
          this.isSubmitting = false;
          return;
        }

        const existingPost = posts[postIndex];
        const isOwner = existingPost.authorId === session.userId;
        const isAdmin = session.role === 'admin';

        if (!isOwner && !isAdmin) {
          this.router.navigate(['/blogs']);
          return;
        }

        posts[postIndex] = {
          ...existingPost,
          title: title,
          content: content
        };

        this.storageService.savePosts(posts);
        this.router.navigate(['/blogs']);
      } else {
        const newPost: Post = {
          id: 'post-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8),
          title: title,
          content: content,
          createdAt: new Date().toISOString(),
          authorId: session.userId,
          authorName: session.displayName
        };

        posts.push(newPost);
        this.storageService.savePosts(posts);
        this.router.navigate(['/blogs']);
      }
    } catch {
      this.errorMessage = 'An error occurred while saving the post. Please try again.';
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/blogs']);
  }
}