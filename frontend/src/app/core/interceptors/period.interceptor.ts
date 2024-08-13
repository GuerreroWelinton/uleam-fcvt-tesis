import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const PeriodInterceptor: HttpInterceptorFn = (req, next) => {
  // const periodService = inject(PeriodService);
  // const period = periodService.getPeriodCode();

  // if (period) {
  //   const periodReq = req.clone({
  //     setHeaders: { PeriodCode: period },
  //   });
  //   return next(periodReq);
  // }

  return next(req);
};
