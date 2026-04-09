import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AvatarComponent } from '../avatar/avatar.component';
import { AuthService } from '../../services/auth.service';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  displayName: string = '';
  avatarInitial: string = '';
  isAdmin: boolean = false;
  private sessionSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sessionSubscription = this.authService.session$.subscribe((session: Session | null) => {
      if (session) {
        this.displayName = session.displayName;
        this.avatarInitial = session.displayName ? session.displayName.charAt(0).toUpperCase() : '?';
        this.isAdmin = session.role === 'admin';
      } else {
        this.displayName = '';
        this.avatarInitial = '?';
        this.isAdmin = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe();
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}