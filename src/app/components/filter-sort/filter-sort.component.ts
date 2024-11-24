import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { TaskModel } from '../../Models/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-sort',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-sort.component.html',
  styleUrls: ['./filter-sort.component.css'],
})
export class FilterSortComponent {
  @Input() tasks: TaskModel[] = [];
  @Output() filteredAndSortedTasksChange = new EventEmitter<TaskModel[]>();

  filterText: string = '';
  filterPriority: string = 'all';
  filterVisibleState: WritableSignal<boolean> = signal(true);
  filterVisible = signal(false);
  sortKey: keyof TaskModel = 'dueDate';
  sortOrder: 'asc' | 'desc' = 'asc';
  priorityOptions: string[] = ['High', 'Medium', 'Low', 'Very Low'];

  private priorityMap: { [key: string]: number } = {
    High: 4,
    Medium: 3,
    Low: 2,
    'very Low': 1,
    '': -1,
  };

  toggleFilterVisibility() {
    this.filterVisible.set(!this.filterVisible());
  }

  private applyFiltersAndSorting(): void {
    let filteredTasks = this.tasks.filter(
      (task) =>
        (task.content.toLowerCase().includes(this.filterText) ||
          (task.description &&
            task.description.toLowerCase().includes(this.filterText))) &&
        (this.filterPriority === 'all' ||
          task.priority === this.priorityMap[this.filterPriority])
    );

    const sortedTasks = filteredTasks.sort((a, b) => {
      const key = this.sortKey;
      const order = this.sortOrder;

      if (!key) return 0;

      let valA: any = a[key];
      let valB: any = b[key];

      if (key === 'dueDate') {
        valA = a.due ? new Date(a.due.date).getTime() : 0;
        valB = b.due ? new Date(b.due.date).getTime() : 0;
      }

      if (key === 'priority') {
        valA = this.priorityMap[a[key as keyof TaskModel] as string];
        valB = this.priorityMap[b[key as keyof TaskModel] as string];
      }

      return order === 'asc' ? valA - valB : valB - valA;
    });

    this.filteredAndSortedTasksChange.emit(sortedTasks);
  }

  onFilterTextChange(): void {
    this.applyFiltersAndSorting();
  }

  onPriorityFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.filterPriority = target.value;
      this.applyFiltersAndSorting();
    }
  }

  onSortChange(key: keyof TaskModel): void {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortOrder = 'asc';
    }
    this.applyFiltersAndSorting();
  }
}
