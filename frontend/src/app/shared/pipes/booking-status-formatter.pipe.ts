import { Pipe, PipeTransform } from '@angular/core';
import { BOOKING_STATES_OPTIONS } from '../../core/constants/component.constant';
import { BOOKING_STATES } from '../../core/enums/general.enum';

@Pipe({
  name: 'bookingStatusFormatter',
  standalone: true,
})
export class BookingStatusFormatterPipe implements PipeTransform {
  transform(status: BOOKING_STATES): { class: string; label: string } {
    const option = BOOKING_STATES_OPTIONS[status];
    return option
      ? { class: option.class, label: option.label }
      : { class: '', label: '' };
  }
}
