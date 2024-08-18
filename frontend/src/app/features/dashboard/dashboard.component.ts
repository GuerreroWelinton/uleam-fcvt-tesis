import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store';
import { selectAuthUser } from '../../core/store/user/user.selectors';

import { AsyncPipe } from '@angular/common';
import { SectionBookingsComponent } from './components/section-bookings/section-bookings.component';
import { SectionStatisticsComponent } from './components/section-statistics/section-statistics.component';
import { SectionWelcomeComponent } from './components/section-welcome/section-welcome.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    SectionWelcomeComponent,
    SectionStatisticsComponent,
    AsyncPipe,
    SectionBookingsComponent,
    // SectionTopUsersBookingsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export default class DashboardComponent {
  public profile$ = this._store.select(selectAuthUser);

  constructor(private _store: Store<AppState>) {}
}
