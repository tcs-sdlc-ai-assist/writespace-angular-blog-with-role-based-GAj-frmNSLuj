import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserRowComponent } from '../../components/user-row/user-row.component';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import type { User } from '../../models/user.model';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, UserRowComponent, AvatarComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  createUserForm!: FormGroup;
  users: User[] = [];
  currentUserId: string = '';
  isSubmitting: boolean = false;
  isLoadingUsers: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const session = this.authService.getSession();
    if (!session || session.role !== 'admin') {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUserId = session.userId;

    this.createUserForm = new FormGroup({
      displayName: new FormControl('', [
        Validators.required,
        Validators.minLength(2)
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ]),
      role: new FormControl('', [
        Validators.required
      ])
    }, { validators: this.passwordMatchValidator });

    this.loadUsers();
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.users = this.storageService.getUsers();
    this.isLoadingUsers = false;
  }

  onSubmit(): void {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const displayName = this.createUserForm.get('displayName')?.value?.trim();
    const username = this.createUserForm.get('username')?.value?.trim();
    const password = this.createUserForm.get('password')?.value;
    const role = this.createUserForm.get('role')?.value;

    const existingUsers = this.storageService.getUsers();
    const usernameTaken = existingUsers.find((u: User) => u.username === username);

    if (usernameTaken) {
      this.errorMessage = 'Username is already taken. Please choose a different one.';
      this.isSubmitting = false;
      return;
    }

    const newUser: User = {
      id: 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8),
      displayName: displayName,
      username: username,
      password: password,
      role: role === 'admin' ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };

    existingUsers.push(newUser);
    this.storageService.saveUsers(existingUsers);

    this.successMessage = `User "${displayName}" created successfully.`;
    this.createUserForm.reset();
    this.createUserForm.get('role')?.setValue('');
    this.isSubmitting = false;

    this.loadUsers();
  }

  onDeleteUser(userId: string): void {
    const userToDelete = this.users.find((u: User) => u.id === userId);

    if (!userToDelete) {
      return;
    }

    if (userToDelete.username === 'admin' && userToDelete.role === 'admin') {
      this.errorMessage = 'Cannot delete the default admin account.';
      this.successMessage = '';
      return;
    }

    if (userId === this.currentUserId) {
      this.errorMessage = 'Cannot delete your own account.';
      this.successMessage = '';
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete user "${userToDelete.displayName}"?`);
    if (!confirmed) {
      return;
    }

    const updatedUsers = this.users.filter((u: User) => u.id !== userId);
    this.storageService.saveUsers(updatedUsers);

    this.successMessage = `User "${userToDelete.displayName}" has been deleted.`;
    this.errorMessage = '';

    this.loadUsers();
  }

  onEditUser(_userId: string): void {
    // Edit functionality placeholder — not implemented in current scope
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}