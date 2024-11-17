import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true,
  pure: true
})
export class DateFormatPipe implements PipeTransform {

  transform(value: Date | string): string {
    if (!value) return '';
    const date = new Date(value);

    const daysOfWeek = [
        'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'
    ]
    const monthsOfYear = [
      'Stycznia', 'Lutego', 'Marca', 'Kwietnia', 'Maja', 'Czerwca',
      'Lipca', 'Sierpnia', 'Września', 'Października', 'Listopada', 'Grudnia'
    ];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = monthsOfYear[date.getMonth()];
    const year = date.getFullYear();

    return `Dziś jest ${dayOfWeek} ${dayOfMonth} ${month} ${year} roku`;
  }
  


}
