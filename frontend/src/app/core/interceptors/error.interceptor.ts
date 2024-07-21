import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IApiResponse } from '../interfaces/api-response.interface';
import { AlertService } from '../services/alert.service';
import { inject } from '@angular/core';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  // const router = inject(Router);
  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      console.log('🚀 ~ catchError ~ err:', err);
      let errorMessage = '';

      if (err.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${err.error.message}`;
      } else {
        // Error del lado del servidor
        const apiError = err.error as IApiResponse<null>;
        errorMessage = apiError.message || 'Error de servidor';
      }

      // Muestra el error usando un servicio de notificación
      alertService.showAlert({ type: 'danger', message: errorMessage });

      // Puedes redirigir al usuario a una página de error si es necesario
      // router.navigate(['/error-page']);

      return throwError(() => new Error(errorMessage));
    })
  );
};
