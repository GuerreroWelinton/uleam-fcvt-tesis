import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CustomizerSettingsService } from '../../shared/components/customizer-settings/customizer-settings.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store';
import { selectAuthUser } from '../../core/store/user/user.selectors';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { RoleFormatterPipe } from '../../shared/pipes/role-formatter.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    RouterLinkActive,
    AsyncPipe,
    JsonPipe,
    DatePipe,
    RoleFormatterPipe,
  ],

  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export default class ProfileComponent {
  public profile$ = this._store.select(selectAuthUser);

  constructor(
    public themeService: CustomizerSettingsService,
    private _store: Store<AppState>
  ) {}

  // Dark Mode
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
