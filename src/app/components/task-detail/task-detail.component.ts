import { Component, inject, Input } from '@angular/core';
import { TasksService } from '../../Services/tasks.service';
import { TaskModel } from '../../Models/task.model';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [AsyncPipe, CommonModule, FormsModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css',
  providers: [DatePipe],
})
export class TaskDetailComponent {
  task: TaskModel | null = null;

  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private taskservice: TasksService = inject(TasksService);
  private datePipe = inject(DatePipe);
  ngOnInit(): void {
    const taskId = this.activatedRoute.snapshot.paramMap.get('taskId');

    if (taskId) {
      this.taskservice.getTask(taskId).subscribe((task) => {
        console.log('Pobrane zadanie:', task);
        this.task = task;
      });
    }
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
}
