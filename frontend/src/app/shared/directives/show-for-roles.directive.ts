import {
  Directive,
  DoCheck,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { USER_ROLES } from '../../core/enums/general.enum';
import { TokenService } from '../../core/services/token.service';

@Directive({
  selector: '[sharedShowForRoles]',
  standalone: true,
})
export class ShowForRolesDirective implements OnInit, OnDestroy, DoCheck {
  @Input('sharedShowForRoles') allowedRoles: USER_ROLES[] = [];

  private currentRoles: USER_ROLES[] = [];

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _templateRef: TemplateRef<any>,
    private _tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this._updateView();
  }

  ngOnDestroy(): void {
    this._viewContainerRef.clear();
  }

  ngDoCheck(): void {
    const newRoles = this._tokenService.getUserRoles();
    if (this._rolesChanged(newRoles)) {
      this.currentRoles = newRoles;
      this._updateView();
    }
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
