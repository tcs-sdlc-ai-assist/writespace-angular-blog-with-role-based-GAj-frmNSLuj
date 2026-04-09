import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [style.border-left-color]="color">
      <div class="stat-label">{{ label }}</div>
      <div class="stat-value">{{ value }}</div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: #ffffff;
      border-radius: 8px;
      padding: 24px;
      border-left: 4px solid #3b82f6;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .stat-label {
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #111827;
    }
  `]
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: number | string = '';
  @Input() color: string = '#3b82f6';
}