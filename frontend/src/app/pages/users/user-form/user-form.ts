import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../core/services/user';
import { NotificationService } from '../../../core/services/notification';
import { UserRequest } from '../../../shared/models/user-request.model';
import { UpdateUserRequest } from '../../../shared/models/update-user.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserForm implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  isLoading = false;
  isSubmitting = false;

  roles = [
    { value: 'ADMIN', viewValue: 'Admin' },
    { value: 'USER', viewValue: 'User' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      role: ['', Validators.required],
      active: [true]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.userId = +idParam;
      this.loadUser(this.userId);
    }
  }

  loadUser(id: number): void {
    this.isLoading = true;
    this.userForm.disable();
    this.cdr.detectChanges();

    this.userService.getUserById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const user = response.data;
          this.userForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            active: user.active
          });
        } else {
          this.notificationService.error(response.message || 'Failed to load user data');
          this.router.navigate(['/users']);
        }
        this.isLoading = false;
        this.userForm.enable();
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.userForm.enable();
        let errorMsg = 'An error occurred while loading user data.';
        if (err.status === 404) {
          errorMsg = 'User not found.';
        }
        this.notificationService.error(errorMsg);
        this.router.navigate(['/users']);
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.userForm.disable();
    this.cdr.detectChanges();

    const formValue = this.userForm.value;

    if (this.isEditMode && this.userId) {
      const updateRequest: UpdateUserRequest = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        role: formValue.role,
        active: formValue.active
      };

      this.userService.updateUser(this.userId, updateRequest).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('User updated successfully.');
            this.router.navigate(['/users']);
          } else {
            this.notificationService.error(response.message || 'Failed to update user.');
            this.isSubmitting = false;
            this.userForm.enable();
            this.cdr.detectChanges();
          }
        },
        error: this.handleError.bind(this)
      });
    } else {
      const createRequest: UserRequest = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        role: formValue.role
      };

      this.userService.createUser(createRequest).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('User created successfully.');
            this.router.navigate(['/users']);
          } else {
            this.notificationService.error(response.message || 'Failed to create user.');
            this.isSubmitting = false;
            this.userForm.enable();
            this.cdr.detectChanges();
          }
        },
        error: this.handleError.bind(this)
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  private handleError(err: HttpErrorResponse): void {
    this.isSubmitting = false;
    this.userForm.enable();
    this.cdr.detectChanges();
  }
}
