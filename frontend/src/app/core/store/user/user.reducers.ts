import { createReducer, on } from '@ngrx/store';
import { IUser } from '../../../features/users/interfaces/user.interface';
import { UserActions } from './user.actions';

export interface IUserState {
  user: IUser | null;
  token: string | null;
  error: string | null;
}

export const initialState: IUserState = {
  user: null,
  token: null,
  error: null,
};

const loginSuccess = (
  state: IUserState,
  { user, token }: { user: IUser; token: string }
): IUserState => ({
  ...state,
  user,
  token,
  error: null,
});

const loginFailure = (
  state: IUserState,
  { error }: { error: string }
): IUserState => ({
  ...state,
  error,
});

const logout = (state: IUserState): IUserState => ({
  ...state,
  user: null,
  token: null,
  error: null,
});

const preAuthSuccess = (
  state: IUserState,
  { user, token }: { user: IUser; token: string }
): IUserState => ({
  ...state,
  user,
  token,
  error: null,
});

const preAuthFailure = (
  state: IUserState,
  { error }: { error: string }
): IUserState => ({
  ...state,
  error,
});

export const userReducer = createReducer(
  initialState,
  on(UserActions.loginSuccess, loginSuccess),
  on(UserActions.loginFailure, loginFailure),
  on(UserActions.logout, logout),
  on(UserActions.preAuthSuccess, preAuthSuccess),
  on(UserActions.preAuthFailure, preAuthFailure)
);
