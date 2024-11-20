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
  public filterCriteria = {
    text: '',
    priority: null as 'high' | 'medium' | 'low' | 'very low' | null,
    dateRange: { start: null as Date | null, end: null as Date | null },
  };
  public filterText: string = '';
  filterTasks(): void {
    let filteredTasks = this.originalTasks;
  
    // Filtrowanie po tekście
    if (this.filterCriteria.text) {
      filteredTasks = filteredTasks.filter((task) =>
        task.content.toLowerCase().includes(this.filterCriteria.text.toLowerCase())
      );
    }
    const priorityMap: { [key: number]: 'high' | 'medium' | 'low' | 'very low' } = {
      1: 'high',
      2: 'medium',
      3: 'low',
      4: 'very low'
    };
  
    // Filtrowanie po priorytecie
    if (this.filterCriteria.priority !== null) {
      filteredTasks = filteredTasks.filter(
        (task) => priorityMap[task.priority] === this.filterCriteria.priority
      );
    }
  
  
    // Filtrowanie po zakresie dat
    if (this.filterCriteria.dateRange.start !== null && this.filterCriteria.dateRange.end !== null) {
      filteredTasks = filteredTasks.filter((task) => {
        const dueDate = new Date(task.dueDate);
        return (
          dueDate >= this.filterCriteria.dateRange.start! &&
          dueDate <= this.filterCriteria.dateRange.end!
        );
      });
    }
  
    this.tasksSignal.set(filteredTasks);
  }
  
  public originalTasks: TaskModel[] = [];
  public sortKey: keyof TaskModel | null = null;
  public sortOrder: 'asc' | 'desc' = 'asc';
  sortTasks(): void {
    const sortedTasks = [...this.tasksSignal()].sort((a, b) => {
      if (this.sortKey) {
        let valA: any = a[this.sortKey];
        let valB: any = b[this.sortKey];
  
        // Sprawdzenie, czy klucz dotyczy daty
        if (this.sortKey === 'dueDate') {
          valA = typeof valA === 'string' || typeof valA === 'number' ? new Date(valA).getTime() : 0;
          valB = typeof valB === 'string' || typeof valB === 'number' ? new Date(valB).getTime() : 0;
        }
  
        // Sprawdzenie, czy klucz dotyczy priorytetu (jako liczba)
        if (this.sortKey === 'priority') {
          valA = typeof valA === 'number' ? valA : 0;
          valB = typeof valB === 'number' ? valB : 0;
        }
  
        if (this.sortOrder === 'asc') {
          return valA > valB ? 1 : valA < valB ? -1 : 0;
        } else {
          return valA < valB ? 1 : valA > valB ? -1 : 0;
        }
      }
      return 0;
    });
  
    this.tasksSignal.set(sortedTasks);
  }
}
