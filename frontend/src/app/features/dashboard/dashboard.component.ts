import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store';
import { selectAuthUser } from '../../core/store/user/user.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, MatCardModule, JsonPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export default class DashboardComponent {
  public profile$ = this._store.select(selectAuthUser);

  constructor(private _store: Store<AppState>) {}
}
