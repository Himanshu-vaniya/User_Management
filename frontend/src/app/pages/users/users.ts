import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { UserService } from '../../core/services/user';
import { AuthService } from '../../core/services/auth';
import { User } from '../../shared/models/user.model';
import { NotificationService } from '../../core/services/notification';
import { DeleteConfirmationDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { SearchBox } from '../../shared/components/search-box/search-box';
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
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule,
    EmptyState,
    SearchBox
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['name', 'email', 'role', 'active', 'actions'];
  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    // Set custom sort accessor to combine firstName and lastName for the "name" column
    this.dataSource.sortingDataAccessor = (item: User, property: string) => {
      switch (property) {
        case 'name':
          return `${item.firstName} ${item.lastName}`.toLowerCase();
        default:
          return (item as any)[property];
      }
    };

    // Set custom filter predicate to match name, email, or role
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const searchStr = filter.toLowerCase();
      const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
      const email = data.email.toLowerCase();
      const role = data.role.toLowerCase();
      return fullName.includes(searchStr) || email.includes(searchStr) || role.includes(searchStr);
    };
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.cdr.detectChanges();
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.dataSource.data = response;
          this.errorMessage = null;
        } else if (response && response.success !== false && Array.isArray(response.data)) {
          this.dataSource.data = response.data;
          this.errorMessage = null;
        } else if (response && Array.isArray(response.data)) {
          this.dataSource.data = response.data;
          this.errorMessage = null;
        } else if (response && response.success === false) {
          this.errorMessage = response.message || 'Failed to load users';
        } else if (response && response.data !== undefined && response.data !== null) {
          this.dataSource.data = Array.isArray(response.data) ? response.data : [response.data];
          this.errorMessage = null;
        } else {
          this.errorMessage = response?.message || 'Failed to load users';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err?.error?.message || 'An error occurred while loading users. Please check if the backend server is running.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(query: string): void {
    this.dataSource.filter = query.trim().toLowerCase();
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
              }
            },
            error: (err: HttpErrorResponse) => {
              if (err.status === 404) {
                this.loadUsers();
              }
            }
          })
        )
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
