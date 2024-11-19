import {
  Component,
  inject,
  signal,
  WritableSignal,
  computed,
} from '@angular/core';
import { TasksService } from '../../Services/tasks.service';
import { TaskModel } from '../../Models/task.model';
import { TrunctePipe } from '../../Pipes/truncte.pipe';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../UI/modal/modal.component';
import { CardComponent } from '../UI/card/card.component';
import { EditTaskModalComponent } from '../edit-task-modal/edit-task-modal.component';
import { from, switchMap } from 'rxjs';
import { DragAndDropDirective } from '../../directives/drag-and-drop.directive';
import { SortAndFilterComponent } from '../UI/sort-and-filter/sort-and-filter.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    TrunctePipe,
    AsyncPipe,
    CommonModule,
    FormsModule,
    RouterModule,
    ModalComponent,
    CardComponent,
    EditTaskModalComponent,
    DragAndDropDirective,
    SortAndFilterComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  providers: [DatePipe],
})
export class TaskListComponent {
  private readonly taskService = inject(TasksService);
  private readonly datePipe = inject(DatePipe);

  public readonly tasksSignal: WritableSignal<TaskModel[]> = signal<
    TaskModel[]
  >([]);
  public readonly editableTask: WritableSignal<TaskModel | undefined> =
    signal(undefined);
  public readonly selectedTask: WritableSignal<TaskModel | undefined> =
    signal(undefined);
  public readonly showModal = signal(false);

  formatDate(date: string | undefined): string {
    return date ? new Date(date).toLocaleDateString() : 'Brak daty';
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.originalTasks = tasks;  // Zapisujemy oryginalną listę zadań
      this.tasksSignal.set(tasks);
    });
  }
 
  onTaskReordered(event: { from: string; to: string }): void {
    const fromIndex = this.tasksSignal().findIndex(task => task.id === event.from);
    const toIndex = this.tasksSignal().findIndex(task => task.id === event.to);

    if (fromIndex !== -1 && toIndex !== -1) {
      const reorderedTasks = [...this.tasksSignal()];
      const [movedTask] = reorderedTasks.splice(fromIndex, 1);
      reorderedTasks.splice(toIndex, 0, movedTask);
      this.tasksSignal.set(reorderedTasks);
    }
  }
  openEditModal(task: TaskModel): void {
    this.editableTask.set({ ...task });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveTask(updatedTask: TaskModel): void {
    if (updatedTask) {
      from(
        this.taskService.updateTask(
          updatedTask.id,
          updatedTask.content,
          updatedTask.description,
          updatedTask.dueDate,
          updatedTask.priority
        )
      )
        .pipe(switchMap(() => this.taskService.getTasks()))
        .subscribe((updatedTasks: TaskModel[]) => {
          this.tasksSignal.set(updatedTasks);
          this.closeModal();
        });
    }
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.tasksSignal.set(
        this.tasksSignal().filter((task) => task.id !== taskId)
      );
    });
  }

  onFilterChange(filterText: string): void {
    this.filterText = filterText;
    this.filterTasks();
  }

  onSortChange({ key, order }: { key: keyof TaskModel; order: 'asc' | 'desc' }): void {
    this.sortKey = key;
    this.sortOrder = order;
    this.sortTasks();
  }
  public filterText: string = '';
  filterTasks(): void {
    if (this.filterText === '') {
      this.tasksSignal.set(this.originalTasks);
    } else {
      const filteredTasks = this.originalTasks.filter((task) =>
        task.content.toLowerCase().includes(this.filterText.toLowerCase())
      );
      this.tasksSignal.set(filteredTasks);
    }
  }
  public originalTasks: TaskModel[] = [];
  public sortKey: keyof TaskModel | null = null;
  public sortOrder: 'asc' | 'desc' = 'asc';
  sortTasks(): void {
    const sortedTasks = [...this.tasksSignal()].sort((a, b) => {
      if (this.sortKey) {
        const valA = a[this.sortKey];
        const valB = b[this.sortKey];
  
        // Sprawdzamy, czy valA i valB nie są null lub undefined przed porównaniem
        const safeValA = valA != null ? valA : ''; // Domyślnie traktujemy null/undefined jako pusty ciąg
        const safeValB = valB != null ? valB : ''; // To samo dla valB
  
        if (this.sortOrder === 'asc') {
          return safeValA > safeValB ? 1 : (safeValA < safeValB ? -1 : 0);
        } else {
          return safeValA < safeValB ? 1 : (safeValA > safeValB ? -1 : 0);
        }
      }
      return 0;
    });
  
    this.tasksSignal.set(sortedTasks);
  }
  
}
