import { Component, inject, OnInit, Signal } from '@angular/core';
import { TasksService } from '../../Services/tasks.service';
import { TaskModel } from '../../Models/task.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { TrunctePipe } from '../../Pipes/truncte.pipe';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TrunctePipe, AsyncPipe, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
taskService: TasksService = inject(TasksService);

tasks$: Observable<TaskModel[]> = this.taskService.getTasks()

deleteTask(taskId: string): void {
  this.taskService.deleteTask(taskId).subscribe(() => {
    console.log('Zadanie zostało pomyślnie usunięte.');
    
   
    this.tasks$ = this.taskService.getTasks();
  });
}

}