import { AsyncPipe, NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { ROLE_TEXTS } from '../../../core/constants/user.constant';
import { AppState } from '../../../core/store';
import { UserActions } from '../../../core/store/user/user.actions';
import { selectAuthUser } from '../../../core/store/user/user.selectors';
import { ToggleService } from '../../../shared/components/sidebar/toggle.service';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatMenuModule,
    NgClass,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public isSidebarToggled$ = this._toggleService.isSidebarToggled$;
  public profile$ = this._store.select(selectAuthUser);
  public ROLE_TEXTS = ROLE_TEXTS;

  constructor(
    private _toggleService: ToggleService,
    public themeService: CustomizerSettingsService,
    private _store: Store<AppState>
  ) {}

  // Burger Menu Toggle
  public toggle() {
    this._toggleService.toggle();
  }

  // Header Sticky
  public isSticky: boolean = false;
  @HostListener('window:scroll', ['$event'])
  private checkScroll() {
    const scrollPosition =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (scrollPosition >= 50) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  // Dark Mode
  public toggleTheme() {
    this.themeService.toggleTheme();
  }

  // Logout
  public logout(): void {
    this._store.dispatch(UserActions.logout());
  }
}
