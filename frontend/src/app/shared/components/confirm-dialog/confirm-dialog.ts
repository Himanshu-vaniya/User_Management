import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';

export interface ConfirmDialogData {
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'accent' | 'warn';
  onConfirm?: () => Observable<any>;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class DeleteConfirmationDialogComponent {
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onCancel(): void {
    if (!this.isLoading) {
      this.dialogRef.close(false);
    }
  }

  onConfirm(): void {
    if (this.isLoading) return;

    if (this.data.onConfirm) {
      this.isLoading = true;
      this.data.onConfirm().subscribe({
        next: (response) => {
          this.isLoading = false;
          // If the callback returns a response, verify if success is true/false or present
          if (response && response.success === false) {
            // Keep open if API specifically returned success: false
            return;
          }
          this.dialogRef.close(true);
        },
        error: () => {
          this.isLoading = false;
          // Keep dialog open on error so parent error handler messages are visible
        }
      });
    } else {
      this.dialogRef.close(true);
    }
  }
}
