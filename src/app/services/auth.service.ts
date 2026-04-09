import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import type { Session } from '../models/session.model';
import type { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionSubject: BehaviorSubject<Session | null>;
  session$;

  constructor(private storageService: StorageService) {
    const existingSession = this.storageService.getSession();
    this.sessionSubject = new BehaviorSubject<Session | null>(existingSession);
    this.session$ = this.sessionSubject.asObservable();
  }

  login(username: string, password: string): boolean {
    const users = this.storageService.getUsers();
    const matchedUser = users.find(
      (u: User) => u.username === username && u.password === password
    );

    if (!matchedUser) {
      return false;
    }

    const session: Session = {
      userId: matchedUser.id,
      username: matchedUser.username,
      displayName: matchedUser.displayName,
      role: matchedUser.role
    };

    this.storageService.saveSession(session);
    this.sessionSubject.next(session);
    return true;
  }

  register(displayName: string, username: string, password: string): boolean {
    const users = this.storageService.getUsers();
    const existingUser = users.find((u: User) => u.username === username);

    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8),
      displayName: displayName,
      username: username,
      password: password,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.storageService.saveUsers(users);

    const session: Session = {
      userId: newUser.id,
      username: newUser.username,
      displayName: newUser.displayName,
      role: newUser.role
    };

    this.storageService.saveSession(session);
    this.sessionSubject.next(session);
    return true;
  }

  logout(): void {
    this.storageService.clearSession();
    this.sessionSubject.next(null);
  }

  getSession(): Session | null {
    return this.sessionSubject.getValue();
  }

  isLoggedIn(): boolean {
    return this.sessionSubject.getValue() !== null;
  }

  isAdmin(): boolean {
    const session = this.sessionSubject.getValue();
    return session !== null && session.role === 'admin';
  }
}