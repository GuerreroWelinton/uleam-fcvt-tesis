import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UserActions } from './user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private _actions$: Actions,
    private _authService: AuthService,
    private _router: Router
  ) {}

  public login$ = createEffect(() =>
    this._actions$.pipe(
      ofType(UserActions.login),
      mergeMap((action) =>
        this._authService.login(action.email, action.password).pipe(
          map((response) => {
            const user = response.data?.result;
            const token = response.token;
            if (user && token) {
              return UserActions.loginSuccess({ user, token });
            } else {
              return UserActions.loginFailure({
                error: 'Invalid login response',
              });
            }
          }),
          catchError((error) =>
            of(UserActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  public loginSuccess$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(UserActions.loginSuccess),
        tap(() => this._router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );

  public logout$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(UserActions.logout),
        tap(() => this._authService.logout())
      ),
    { dispatch: false }
  );

  public preAuth$ = createEffect(() =>
    this._actions$.pipe(
      ofType(UserActions.preAuth),
      mergeMap(() => {
        return this._authService.isAuthenticated().pipe(
          map((user) => {
            // console.log('🚀 ~ UserEffects ~ map ~ user:', user);
            if (user) {
              return UserActions.preAuthSuccess({ user });
            } else {
              return UserActions.preAuthFailure({
                error: 'User not authenticated',
              });
            }
          }),
          catchError((error) =>
            of(UserActions.preAuthFailure({ error: error.message }))
          )
        );
      })
    )
  );
}
