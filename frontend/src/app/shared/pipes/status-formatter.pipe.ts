import { Pipe, PipeTransform } from '@angular/core';
import { BASE_STATES_OPTIONS } from '../../core/constants/component.constant';
import { BASE_RECORD_STATES } from '../../core/enums/general.enum';

@Pipe({
  name: 'statusFormatter',
  standalone: true,
})
export class StatusFormatterPipe implements PipeTransform {
  transform(status: any): { class: string; label: string } {
    if (!isBaseRecordState(status)) {
      return { class: '', label: '' };
    }

    return {
      class: BASE_STATES_OPTIONS[status].class,
      label: BASE_STATES_OPTIONS[status].label,
    };
  }
}

function isBaseRecordState(value: any): value is BASE_RECORD_STATES {
  return Object.values(BASE_RECORD_STATES).includes(value);
}
