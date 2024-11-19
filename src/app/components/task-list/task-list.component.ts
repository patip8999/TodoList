import {
  Component,
  inject,
  signal,
  Signal,
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

  sortTasksByDate(): void {
    const sortedTasks = [...this.tasksSignal()].sort((a, b) => {
      // Sprawdzamy, czy due.date jest dostępne, i przekształcamy na timestamp
      const dateA = a.due?.date ? new Date(a.due.date).getTime() : Infinity; // Jeśli brak daty, ustaw na najpóźniejszą
      const dateB = b.due?.date ? new Date(b.due.date).getTime() : Infinity;
  
      return dateA - dateB;
    });
    this.tasksSignal.set(sortedTasks);
  }
  

  // Sortowanie zadań po priorytecie
  sortTasksByPriority(): void {
    const sortedTasks = [...this.tasksSignal()].sort((a, b) => {
      const priorityA = Number(a.priority); // Konwersja na liczbę
      const priorityB = Number(b.priority); // Konwersja na liczbę
      
      return priorityA - priorityB;  // Porównanie liczbowe
    });
  
    this.tasksSignal.set(sortedTasks);
  }
  // Pomocnicza funkcja do mapowania priorytetów na liczby
  private getPriorityValue(priority: string): number {
    switch (priority.toLowerCase()) {
      case 'high': return 1;
      case 'medium': return 2;
      case 'low': return 3;
      default: return 4;
    }
  }
  public filterText: string = '';
  public originalTasks: TaskModel[] = [];
  // ... existing methods

  // Filtrowanie zadań
  filterTasks(): void {
    if (this.filterText === '') {
      // Jeśli pole wyszukiwania jest puste, przywracamy oryginalną listę zadań
      this.tasksSignal.set(this.originalTasks);
    } else {
      const filteredTasks = this.originalTasks.filter(task => {
        const searchText = this.filterText.toLowerCase();
        return (
          task.content.toLowerCase().includes(searchText) ||
          (task.description && task.description.toLowerCase().includes(searchText)) ||
          (task.dueDate && task.dueDate.toLowerCase().includes(searchText)) ||
          task.priority.toString().toLowerCase().includes(searchText)
        );
      });
      this.tasksSignal.set(filteredTasks);
    }
  }
}

