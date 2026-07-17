import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
  @Input() icon = 'people_outline';
  @Input() title = 'No records found';
  @Input() description = 'Try adding a new record.';
  @Input() actionText = '';

  @Output() action = new EventEmitter<void>();

  onActionClick(): void {
    this.action.emit();
  }
}
