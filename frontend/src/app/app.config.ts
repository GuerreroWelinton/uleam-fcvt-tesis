import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { effects, metaReducers, reducers } from './core/store';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { PeriodInterceptor } from './core/interceptors/period.interceptor';
import { TokenInterceptor } from './core/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    // PeriodInterceptor
    provideHttpClient(withInterceptors([ErrorInterceptor, TokenInterceptor])),
    provideClientHydration(),
    provideStore(reducers, { metaReducers }),
    provideEffects(effects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
