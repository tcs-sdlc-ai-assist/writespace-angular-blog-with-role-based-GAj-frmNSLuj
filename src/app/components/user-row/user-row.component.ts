import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../avatar/avatar.component';
import type { User } from '../../models/user.model';

@Component({
  selector: 'app-user-row',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.css']
})
export class UserRowComponent {
  @Input() user!: User;
  @Input() currentUserId: string = '';

  @Output() delete = new EventEmitter<string>();

  get isDefaultAdmin(): boolean {
    return this.user.username === 'admin' && this.user.role === 'admin';
  }

  get isSelf(): boolean {
    return this.user.id === this.currentUserId;
  }

  get isDeleteDisabled(): boolean {
    return this.isDefaultAdmin || this.isSelf;
  }

  get deleteDisabledTooltip(): string {
    if (this.isDefaultAdmin) {
      return 'Cannot delete the default admin account';
    }
    if (this.isSelf) {
      return 'Cannot delete your own account';
    }
    return 'Delete user';
  }

  get showDeleteButton(): boolean {
    return true;
  }

  onDelete(): void {
    if (!this.isDeleteDisabled) {
      this.delete.emit(this.user.id);
    }
  }
}