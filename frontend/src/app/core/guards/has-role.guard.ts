import { KEYS_LOCAL_STORAGE, USER_ROLES } from '../enums/general.enum';

export function HasRole(allowedRoles: USER_ROLES[]): () => boolean {
  return () => {
    const tokenKey: string = KEYS_LOCAL_STORAGE.TOKEN;
    const token = localStorage.getItem(tokenKey);

    if (!token) {
      return false;
    }

    const payload: string = token.split('.')[1];
    const { roles, exp } = JSON.parse(atob(payload));

    const now: number = new Date().getTime() / 1000;
    if (now >= exp) {
      return false;
    }

    const hasRole = roles.some((role: USER_ROLES) =>
      allowedRoles.includes(role)
    );

    return hasRole;
  };
}
