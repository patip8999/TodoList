import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskModel } from '../../../Models/task.model';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() task: TaskModel | undefined;
  @Input() modalTitle: string = '';
  @Input() modalData: any;
  @Input() onSave: () => void = () => {};
  @Input() onCancel: () => void = () => {};
  @Output() close = new EventEmitter<void>();
  onClose() {
    this.close.emit(); // Emituje zdarzenie zamknięcia
  }
}
