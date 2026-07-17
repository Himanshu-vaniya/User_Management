import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './search-box.html',
  styleUrl: './search-box.css',
})
export class SearchBox {
  @Input() placeholder = 'Search...';
  @Input() value = '';
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  onSearchChange(newValue: string): void {
    this.value = newValue;
    this.search.emit(newValue);
  }

  onClear(): void {
    this.value = '';
    this.clear.emit();
  }
}
