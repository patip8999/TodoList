import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../Services/tasks.service';
import { CardComponent } from '../UI/card/card.component';
export interface TaskForm {
  readonly name: string;
  readonly description: string;
  readonly dueDate: string;
  readonly priority: number 
}
@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css',
})
export class CreateTaskComponent {
  taskService: TasksService = inject(TasksService);
  tasks: any[] = [];
  router: Router = inject(Router);
  model: TaskForm = {
    name: '',
    description: '',
    dueDate: '',
    priority:  0,
  };
  addTask(name: string, description: string, dueDate: string, priority: string): void {
    const taskData = {
      content: name,
      description: description,
      due_date: dueDate,
      priority: parseInt(priority, 10),
    };
  
    this.taskService.addTask(taskData).subscribe((task) => {
      this.tasks.push(task);
      this.router.navigate(['/']); 
    });
  }
}
