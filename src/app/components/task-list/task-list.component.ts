import { Component, computed, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { TasksService } from '../../Services/tasks.service';
import { TaskModel } from '../../Models/task.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { TrunctePipe } from '../../Pipes/truncte.pipe';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../UI/modal/modal.component';
import { CardComponent } from '../UI/card/card.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    TrunctePipe,
    AsyncPipe,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ModalComponent,
    RouterModule,
    CardComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  providers: [DatePipe],
})
export class TaskListComponent {
  taskService: TasksService = inject(TasksService);
  public visibleTaskId = signal<number | undefined>(undefined);
  formatDate(date: string | undefined): string {
    if (!date) {
      return 'Brak daty';
    }
    // dalsze przetwarzanie daty
    return new Date(date).toLocaleDateString(); // przykładowe przetwarzanie daty
  }
  tasks$: Observable<TaskModel[]> = this.taskService.getTasks();
  public selectedTask = signal<TaskModel | undefined>(undefined)
  private datePipe = inject(DatePipe);
  public tasksSignal: WritableSignal<TaskModel[]> = signal<
  TaskModel[]
>([]);

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe(() => {
      console.log('Zadanie zostało pomyślnie usunięte.');

      this.tasks$ = this.taskService.getTasks();
    });
  }
  public toggle(taskId: number, task: TaskModel): void {
    this.visibleTaskId.set(taskId);
    this.selectedTask.set(task)
  }
  public isLoading: Signal<boolean> = computed(
    () => this.tasksSignal() === null
  );

}
