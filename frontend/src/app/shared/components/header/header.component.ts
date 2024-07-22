import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { ROLE_TEXTS } from '../../../core/constants/component.constant';
import { AppState } from '../../../core/store';
import { UserActions } from '../../../core/store/user/user.actions';
import { selectAuthUser } from '../../../core/store/user/user.selectors';
import { PeriodService } from '../../../features/periods/services/period.service';
import { ToggleService } from '../../../shared/components/sidebar/toggle.service';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { tap } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    MatButtonModule,
    MatMenuModule,
    NgClass,
    RouterLink,
    RouterLinkActive,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public isSidebarToggled$ = this._toggleService.isSidebarToggled$;
  public profile$ = this._store.select(selectAuthUser);

  public selectedPeriod: string = '';
  public periods$ = this._periodService.list().pipe(
    tap((periods) => {
      if (periods && periods.data?.result && periods.data.result.length > 0) {
        this.selectedPeriod = periods.data.result[0].id;
      }
    })
  );
  public ROLE_TEXTS = ROLE_TEXTS;

  constructor(
    private _toggleService: ToggleService,
    public themeService: CustomizerSettingsService,
    private _store: Store<AppState>,
    private _periodService: PeriodService
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
