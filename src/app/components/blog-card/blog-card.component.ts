import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from '../avatar/avatar.component';
import type { Post } from '../../models/post.model';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarComponent],
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css']
})
export class BlogCardComponent {
  @Input() post!: Post;
  @Input() isOwner: boolean = false;

  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  get excerpt(): string {
    if (!this.post?.content) {
      return '';
    }
    const maxLength = 150;
    if (this.post.content.length <= maxLength) {
      return this.post.content;
    }
    return this.post.content.substring(0, maxLength).trimEnd() + '...';
  }

  get formattedDate(): string {
    if (!this.post?.createdAt) {
      return '';
    }
    const date = new Date(this.post.createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'medium' as Intl.DateTimeFormatOptions['month'],
      day: 'numeric'
    });
  }

  get authorInitial(): string {
    if (!this.post?.authorName) {
      return '?';
    }
    return this.post.authorName.charAt(0).toUpperCase();
  }

  onEdit(): void {
    this.edit.emit(this.post.id);
  }

  onDelete(): void {
    this.delete.emit(this.post.id);
  }
}