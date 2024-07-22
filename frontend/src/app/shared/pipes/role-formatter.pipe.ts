import { Pipe, PipeTransform } from '@angular/core';
import { USER_ROLES } from '../../core/enums/general.enum';
import { ROLE_TEXTS } from '../../core/constants/component.constant';

@Pipe({
  name: 'roleFormatter',
  standalone: true,
})
export class RoleFormatterPipe implements PipeTransform {
  transform(role: USER_ROLES): string {
    return ROLE_TEXTS[role] || 'Desconocido';
  }
}
