import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IUserState } from './user.reducers';

export const selectUserState = createFeatureSelector<IUserState>('user');

export const selectAuthUser = createSelector(
  selectUserState,
  (state) => state.user
);

export const selectAuthToken = createSelector(
  selectUserState,
  (state) => state.token
);

export const selectAuthError = createSelector(
  selectUserState,
  (state) => state.error
);
