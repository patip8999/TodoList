import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../Services/tasks.service';
export interface TaskForm {
  readonly name: string;
  readonly description: string;
  readonly dueDate: string;
  readonly priority: number | null;
}
@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    priority: null,
  };
  addTask(
    name: string,
    description: string,
    dueDate: string,
    priority: string
  ): void {
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
