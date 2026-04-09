import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="avatar"
      [ngStyle]="{
        'background-color': role === 'admin' ? '#7c3aed' : '#2563eb',
        'color': '#ffffff',
        'width': '48px',
        'height': '48px',
        'border-radius': '50%',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'font-size': '1.5rem',
        'position': 'relative'
      }"
      [attr.aria-label]="displayName + ' (' + role + ')'"
    >
      <span class="avatar-emoji">{{ role === 'admin' ? '👑' : '📖' }}</span>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    .avatar {
      user-select: none;
      cursor: default;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      transition: background-color 0.2s ease;
    }

    .avatar-emoji {
      line-height: 1;
    }
  `]
})
export class AvatarComponent {
  @Input() role: 'admin' | 'user' = 'user';
  @Input() displayName: string = '';
}