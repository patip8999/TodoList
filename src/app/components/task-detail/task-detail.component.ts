import { Component, inject, Input } from '@angular/core';
import { TasksService } from '../../Services/tasks.service';
import { TaskModel } from '../../Models/task.model';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../UI/card/card.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [AsyncPipe, CommonModule, FormsModule, CardComponent],
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
   priorityMap: Record<number, string> = {
    1: 'Very Low',
    2: 'Low',
    3: 'Medium',
    4: 'High'
  };
  
  // Funkcja, która używa mapowania
  getPriorityLabel(priority: number): string {
    return this.priorityMap[priority] || 'Unknown';
  }
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }}
  