import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { IUserState, userReducer } from './user/user.reducers';
import { environment } from '../../../environments/environment.dev';
import { UserEffects } from './user/user.effects';

export interface AppState {
  user: IUserState;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];

export const effects = [UserEffects];
