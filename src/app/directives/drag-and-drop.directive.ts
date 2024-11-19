import {
  Directive,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
  standalone: true
})
export class DragAndDropDirective {
  @Output() taskReordered = new EventEmitter<{ from: string; to: string }>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    const taskId = this.el.nativeElement.getAttribute('data-index');
    event.dataTransfer?.setData('taskId', taskId);
    event.dataTransfer?.setData('index', taskId);

    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grabbing');
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();

    const draggedTaskId = event.dataTransfer?.getData('taskId');
    const targetTaskId = this.el.nativeElement.getAttribute('data-index');

    if (draggedTaskId && targetTaskId) {
      this.taskReordered.emit({
        from: draggedTaskId,
        to: targetTaskId,
      });
    }
  }
}
