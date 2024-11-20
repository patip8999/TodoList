import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskModel } from '../../../Models/task.model';

@Component({
  selector: 'app-sort-and-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sort-and-filter.component.html',
  styleUrls: ['./sort-and-filter.component.css']
})
export class SortAndFilterComponent {
  @Input() items: TaskModel[] = [];
  @Input() filterText: string = '';
  @Input() sortKey: keyof TaskModel | null = null;
  @Input() sortOrder: 'asc' | 'desc' = 'asc';

  @Output() filterChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<{ key: keyof TaskModel; order: 'asc' | 'desc' }>();

  public sortKeys: (keyof TaskModel)[] = ['dueDate', 'priority'];

  // Tworzymy sygnał dla widoczności elementów
  filterVisible = signal(false);

  // Zmieniamy sposób obsługi zmiany filtra
  onFilterChange(value: string): void {
    this.filterChange.emit(value);
  }

  // Zmieniamy sposób obsługi zmiany sortowania
  onSortChange(key: keyof TaskModel): void {
    if (this.sortKey === key) {
      // Zmieniamy kierunek sortowania, jeśli klikniemy ten sam klucz
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Ustawiamy nowy klucz sortowania i domyślny kierunek (rosnąco)
      this.sortKey = key;
      this.sortOrder = 'asc';
    }
    // Emitujemy zmiany sortowania
    this.sortChange.emit({ key, order: this.sortOrder });
  }

  toggleFilterVisibility() {
    this.filterVisible.set(!this.filterVisible());
  }
}
