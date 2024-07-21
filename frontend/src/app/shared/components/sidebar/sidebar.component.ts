import { Component } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ToggleService } from './toggle.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';
import { ShowForRolesDirective } from '../../directives/show-for-roles.directive';
import { USER_ROLES } from '../../../core/enums/user.enum';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgScrollbarModule,
    MatExpansionModule,
    RouterLinkActive,
    RouterModule,
    RouterLink,
    NgClass,
    AsyncPipe,
    ShowForRolesDirective,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  public isSidebarToggled$ = this._toggleService.isSidebarToggled$;
  public USER_ROLES = USER_ROLES;

  constructor(
    private _toggleService: ToggleService,
    public themeService: CustomizerSettingsService
  ) {}

  // Burger Menu Toggle
  public toggle() {
    this._toggleService.toggle();
  }
}
