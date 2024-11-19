import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sort-and-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sort-and-filter.component.html',
  styleUrl: './sort-and-filter.component.css'
})
export class SortAndFilterComponent<T> {
  @Input() items: T[] = [];
  @Input() filterText: string = '';
  @Input() sortKey: keyof T | null = null;
  @Input() sortOrder: 'asc' | 'desc' = 'asc';

  @Output() filterChanged = new EventEmitter<string>();
  @Output() sortChanged = new EventEmitter<{ key: keyof T, order: 'asc' | 'desc' }>();

  public sortKeys: (keyof T)[] = ['content' as keyof T, 'priority' as keyof T];


  // Tworzymy sygnał dla widoczności elementów
  filterVisible = signal(false);

  onFilterChange(value: string): void {
    this.filterChanged.emit(value);
  }

  onSortChange(key: keyof T): void {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortOrder = 'asc';
    }
    this.sortChanged.emit({ key, order: this.sortOrder });
  }

  toggleFilterVisibility() {
    this.filterVisible.set(!this.filterVisible());
  }
}