import { createAction, props } from '@ngrx/store';
import { IUser } from '../../../features/users/interfaces/user.interface';

const UserActionTypes = {
  Login: '[User] Login',
  LoginSuccess: '[User] Login Success',
  LoginFailure: '[User] Login Failure',
  Logout: '[User] Logout',
  PreAuth: '[User] PreAuth',
  PreAuthSuccess: '[User] PreAuth Success',
  PreAuthFailure: '[User] PreAuth Failure',
};

const login = createAction(
  UserActionTypes.Login,
  props<{ email: string; password: string }>()
);

const loginSuccess = createAction(
  UserActionTypes.LoginSuccess,
  props<{ user: IUser; token: string }>()
);

const loginFailure = createAction(
  UserActionTypes.LoginFailure,
  props<{ error: string }>()
);

const logout = createAction(UserActionTypes.Logout);

const preAuth = createAction(UserActionTypes.PreAuth);

const preAuthSuccess = createAction(
  UserActionTypes.PreAuthSuccess,
  props<{ user: IUser; token: string }>()
);

const preAuthFailure = createAction(
  UserActionTypes.PreAuthFailure,
  props<{ error: string }>()
);

export const UserActions = {
  login,
  loginSuccess,
  loginFailure,
  logout,
  preAuth,
  preAuthSuccess,
  preAuthFailure,
};
