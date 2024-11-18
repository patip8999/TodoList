import { Component, computed, inject, signal, Signal, WritableSignal } from '@angular/core';
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
    CardComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'], // Poprawiona nazwa właściwości
  providers: [DatePipe],
})
export class TaskListComponent {
  // Inicjalizacja serwisu
  private taskService = inject(TasksService);
  private datePipe = inject(DatePipe);

  // Sygnały
  public visibleTaskId = signal<number | undefined>(undefined);
  public tasksSignal: WritableSignal<TaskModel[]> = signal<TaskModel[]>([]);
  public selectedTask = signal<TaskModel | undefined>(undefined);
  public showModal = false;

  // Obsługa ładowania
  public isLoading: Signal<boolean> = computed(() => this.tasksSignal().length === 0);

  // Formatowanie daty
  formatDate(date: string | undefined): string {
    if (!date) {
      return 'Brak daty';
    }
    return new Date(date).toLocaleDateString(); // Przykładowe przetwarzanie daty
  }

  // Pobieranie zadań z serwisu
  public tasks$: Observable<TaskModel[]> = this.taskService.getTasks();

  // Usuwanie zadania
  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe(() => {
      console.log('Zadanie zostało pomyślnie usunięte.');
      this.tasks$ = this.taskService.getTasks(); // Odświeżenie zadań
    });
  }

  // Przełączanie widoczności szczegółów zadania
  public toggle(taskId: number, task: TaskModel): void {
    this.visibleTaskId.set(taskId);
    this.selectedTask.set(task);
  }

  // Otwieranie modala
  openModal(task: TaskModel) {
    this.selectedTask.set(task);
    this.showModal = true;
  }

  // Zamknięcie modala
  closeModal() {
    console.log('Zamykam modal');
    this.showModal = false;
  }

  // Zapisywanie zadania
  saveTask() {
    console.log('Task saved:', this.selectedTask());
    this.closeModal();
  }

  // Anulowanie edycji
  cancelEdit() {
    console.log('Edit cancelled');
    this.closeModal();
  }
}
