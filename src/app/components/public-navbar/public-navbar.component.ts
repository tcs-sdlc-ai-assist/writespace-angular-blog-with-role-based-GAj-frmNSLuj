import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AvatarComponent } from '../avatar/avatar.component';
import { AuthService } from '../../services/auth.service';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarComponent],
  templateUrl: './public-navbar.component.html',
  styleUrls: ['./public-navbar.component.css']
})
export class PublicNavbarComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  userInitial: string = '?';
  displayName: string = '';
  userRole: 'admin' | 'user' = 'user';
  dropdownOpen: boolean = false;

  private sessionSubscription: Subscription | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.sessionSubscription = this.authService.session$.subscribe((session: Session | null) => {
      if (session) {
        this.isAuthenticated = true;
        this.displayName = session.displayName;
        this.userRole = session.role;
        this.userInitial = session.displayName ? session.displayName.charAt(0).toUpperCase() : '?';
      } else {
        this.isAuthenticated = false;
        this.displayName = '';
        this.userRole = 'user';
        this.userInitial = '?';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe();
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  onLogout(): void {
    this.closeDropdown();
    this.authService.logout();
  }
}