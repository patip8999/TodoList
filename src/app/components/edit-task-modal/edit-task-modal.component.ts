import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { TaskModel } from '../../Models/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../UI/card/card.component';

@Component({
  selector: 'app-edit-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './edit-task-modal.component.html',
  styleUrl: './edit-task-modal.component.css'
})
export class EditTaskModalComponent {
  @Input() task: TaskModel | undefined; 
  @Output() save = new EventEmitter<TaskModel>();
  @Output() close = new EventEmitter<void>();

  public editableTask: WritableSignal<TaskModel> = signal({} as TaskModel);

  ngOnChanges() {
    console.log('Received task for editing:', this.task);  // Logowanie zadania przed edycją
    if (this.task) {
      this.editableTask.set({ ...this.task });
      console.log('Editable task after setting:', this.editableTask());  // Logowanie po ustawieniu taska
    }
  }
 
  saveTask(): void {
    if (this.editableTask()) {
      console.log('Saving task:', this.editableTask());
      this.save.emit(this.editableTask());
    }
  }

  closeModal() {
    this.close.emit();
  }
}