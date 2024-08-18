import { Pipe, PipeTransform } from '@angular/core';
import { BASE_STATES_OPTIONS } from '../../core/constants/component.constant';
import { BASE_RECORD_STATES } from '../../core/enums/general.enum';

@Pipe({
  name: 'baseStatusFormatter',
  standalone: true,
})
export class BaseStatusFormatterPipe implements PipeTransform {
  transform(status: BASE_RECORD_STATES): { class: string; label: string } {
    const option = BASE_STATES_OPTIONS[status];
    return option
      ? { class: option.class, label: option.label }
      : { class: '', label: '' };
  }
}
