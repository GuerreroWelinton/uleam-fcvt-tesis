import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class DataComparisonService {
  constructor(private _alertService: AlertService) {}
  public compareAndUpdate<T>(
    formValues: Partial<T>,
    selectedValues: Partial<T>,
    keys: (keyof T)[]
  ): Partial<T> {
    const updatedFields: Partial<T> = {};

    for (const key of keys) {
      if (formValues[key] !== selectedValues[key]) {
        if (formValues[key] !== undefined) {
          updatedFields[key] = formValues[key];
        }
      }
    }

    if (!Object.keys(updatedFields).length) {
      this._alertService.showAlert({
        type: 'info',
        message: 'No se puede actualizar el registro porque no hay cambios',
      });
    }

    return updatedFields;
  }
}
