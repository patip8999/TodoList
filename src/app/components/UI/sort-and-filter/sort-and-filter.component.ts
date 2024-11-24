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
  @Output() priorityFilterChange = new EventEmitter<string>(); 

  public sortKeys: (keyof TaskModel)[] = ['dueDate', 'priority'];
  public priorityOptions: string[] = ['High', 'Medium', 'Low', 'very Low']; 

  filterVisible = signal(false);

  onFilterChange(value: string): void {
    this.filterChange.emit(value);
  }

  onSortChange(key: keyof TaskModel): void {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortOrder = 'asc';
    }
    this.sortChange.emit({ key, order: this.sortOrder });
  }

  onPriorityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;  
    this.priorityFilterChange.emit(target.value);  
  }

  toggleFilterVisibility() {
    this.filterVisible.set(!this.filterVisible());
  }
}