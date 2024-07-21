// notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
  type:
    | 'daxa'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';
  message: string;
  timeoutId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$ = this.alertsSubject.asObservable();
  private currentTimeoutId?: number;

  public showAlert(alert: Alert) {
    // Limpiar la alerta actual y su timeout si existe
    if (this.currentTimeoutId) {
      clearTimeout(this.currentTimeoutId);
      this.dismissAlert(this.alertsSubject.value[0], false); // No eliminar inmediatamente, permitir la animación
    }

    // Añadir la nueva alerta y establecer un nuevo timeout
    setTimeout(() => {
      this.alertsSubject.next([alert]);
      this.currentTimeoutId = window.setTimeout(() => {
        this.dismissAlert(alert, true);
        this.currentTimeoutId = undefined;
      }, 3000); // Ocultar la alerta después de 3 segundos
    }, 300); // Delay to allow the previous alert to animate out
  }

  public dismissAlert(alert: Alert, immediate: boolean) {
    if (immediate) {
      this.alertsSubject.next([]);
    } else {
      setTimeout(() => this.alertsSubject.next([]), 300); // Allow animation time
    }
  }
}
