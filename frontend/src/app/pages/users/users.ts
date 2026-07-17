import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UserService } from '../../core/services/user';
import { User } from '../../shared/models/user.model';
import { NotificationService } from '../../core/services/notification';
import { DeleteConfirmationDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs';

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
    MatTooltipModule,
    MatDialogModule
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
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService
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
    this.router.navigate(['/users/new']);
  }

  onEditUser(user: User): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }

  onDeleteUser(user: User): void {
    this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '440px',
      disableClose: true,
      data: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user?',
        itemName: `${user.firstName} ${user.lastName}`,
        confirmText: 'Delete',
        confirmColor: 'warn',
        onConfirm: () => this.userService.deleteUser(user.id).pipe(
          tap({
            next: (response) => {
              if (response.success) {
                this.notificationService.success('User deleted successfully.');
                this.loadUsers();
              } else {
                this.notificationService.error(response.message || 'Unable to delete user.');
              }
            },
            error: (err: HttpErrorResponse) => {
              this.handleDeleteError(err);
            }
          })
        )
      }
    });
  }

  private handleDeleteError(err: HttpErrorResponse): void {
    let errorMsg = 'Unable to delete user.';
    if (err.error && err.error.message) {
      errorMsg = err.error.message;
    } else if (err.status === 400) {
      errorMsg = 'Invalid request. Unable to delete user.';
    } else if (err.status === 403) {
      errorMsg = 'You do not have permission to delete this user.';
    } else if (err.status === 404) {
      errorMsg = 'User not found.';
      this.loadUsers();
    } else if (err.status === 409) {
      errorMsg = 'User cannot be deleted because it is referenced elsewhere.';
    } else if (err.status === 500) {
      errorMsg = 'Server error. Unable to delete user.';
    } else if (err.status === 0) {
      errorMsg = 'Network error. Please check your connection.';
    }
    this.notificationService.error(errorMsg);
  }
}
