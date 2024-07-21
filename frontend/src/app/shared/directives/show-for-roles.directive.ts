import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  DoCheck,
} from '@angular/core';
import { USER_ROLES } from '../../core/enums/user.enum';
import { KEYS_LOCAL_STORAGE } from '../../core/enums/local-storage.enum';

@Directive({
  selector: '[sharedShowForRoles]',
  standalone: true,
})
export class ShowForRolesDirective implements OnInit, OnDestroy, DoCheck {
  @Input('sharedShowForRoles') allowedRoles: USER_ROLES[] = [];

  private currentRoles: USER_ROLES[] = [];

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _templateRef: TemplateRef<any>
  ) {}

  ngOnInit(): void {
    this._updateView();
  }

  ngOnDestroy(): void {
    this._viewContainerRef.clear();
  }

  ngDoCheck(): void {
    const newRoles = this._getUserRoles();
    if (this._rolesChanged(newRoles)) {
      this.currentRoles = newRoles;
      this._updateView();
    }
  }

  private _getUserRoles(): USER_ROLES[] {
    const tokenKey: string = KEYS_LOCAL_STORAGE.TOKEN;
    const token = localStorage.getItem(tokenKey);

    if (!token) {
      return [];
    }

    const payload: string = token.split('.')[1];
    const { roles, exp } = JSON.parse(atob(payload));

    const now: number = new Date().getTime() / 1000;
    if (now >= exp) {
      return [];
    }

    return roles;
  }

  private _rolesChanged(newRoles: USER_ROLES[]): boolean {
    if (newRoles.length !== this.currentRoles.length) {
      return true;
    }
    for (let i = 0; i < newRoles.length; i++) {
      if (newRoles[i] !== this.currentRoles[i]) {
        return true;
      }
    }
    return false;
  }

  private _updateView(): void {
    if (
      this.currentRoles.some((role: USER_ROLES) =>
        this.allowedRoles.includes(role)
      )
    ) {
      this._viewContainerRef.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainerRef.clear();
    }
  }
}
