import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateName',
  standalone: true,
  pure: true
})
export class TrunctePipe implements PipeTransform {

  transform(value: string, maxLength: number = 60): string {
    if (!value) return '';
    return value.length > maxLength ? value.slice(0, maxLength) + '...': value
  }

}
