import {
  Component,
  inject,
  signal,
  WritableSignal,
  computed,
  Signal,
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
    SortAndFilterComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  providers: [DatePipe],
})
export class TaskListComponent {
  private readonly taskService = inject(TasksService);
  private readonly datePipe = inject(DatePipe);

  // Signals
  public readonly tasksSignal: WritableSignal<TaskModel[]> = signal<
    TaskModel[]
  >([]);
  public readonly editableTask: WritableSignal<TaskModel | undefined> =
    signal(undefined);
  public readonly selectedTask: WritableSignal<TaskModel | undefined> =
    signal(undefined);
  public readonly showModal = signal(false);
  public readonly filterText: WritableSignal<string> = signal('');
  public readonly sortKey: WritableSignal<keyof TaskModel | null> =
    signal(null);
  public readonly sortOrder: WritableSignal<'asc' | 'desc'> = signal('asc');
  public originalTasks: TaskModel[] = [];

  public filteredAndSortedTasks: Signal<TaskModel[]> = computed(() => {
    const filter = this.filterText();
    const tasks = this.tasksSignal();

    const filteredTasks = tasks.filter(
      (task) =>
        task.content.toLowerCase().includes(filter.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(filter.toLowerCase()))
    );

    const sortedTasks = filteredTasks.sort((a, b) => {
      const sortKey = this.sortKey();
      const sortOrder = this.sortOrder();

      if (!sortKey) return 0;

      let valA: any = a[sortKey];
      let valB: any = b[sortKey];

      if (sortKey === 'dueDate') {
        valA = a.due ? new Date(a.due.date).getTime() : 0;
        valB = b.due ? new Date(b.due.date).getTime() : 0;
      }

      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return sortedTasks;
  });

  ngOnInit(): void {
    this.loadTasks();
  }
  formatDate(date: string | undefined): string {
    return date ? new Date(date).toLocaleDateString() : 'Brak daty';
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasksSignal.set(tasks);
    });
  }

  onTaskReordered(event: { from: string; to: string }): void {
    const fromIndex = this.tasksSignal().findIndex(
      (task) => task.id === event.from
    );
    const toIndex = this.tasksSignal().findIndex(
      (task) => task.id === event.to
    );

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
    this.filterText.set(filterText);
  }

  onSortChange({
    key,
    order,
  }: {
    key: keyof TaskModel;
    order: 'asc' | 'desc';
  }): void {
    this.sortKey.set(key);
    this.sortOrder.set(order);
  }
}
