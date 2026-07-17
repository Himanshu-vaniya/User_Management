import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../core/services/user';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'role', 'active', 'actions'];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.cdr.detectChanges();
    this.userService.getUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data;
        } else {
          this.errorMessage = response.message || 'Failed to load users';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'An error occurred while loading users. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onAddUser(): void {
    // Placeholder for future phase
    console.log('Navigate to Add User');
  }

  onEditUser(user: User): void {
    // Placeholder for future phase
    console.log('Navigate to Edit User', user.id);
  }

  onDeleteUser(user: User): void {
    // Placeholder for future phase
    console.log('Open Delete Confirmation for User', user.id);
  }
}
