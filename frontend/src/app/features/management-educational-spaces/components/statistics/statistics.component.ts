import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/store';
import { selectAuthUser } from '../../../../core/store/user/user.selectors';
import { combineLatest, first, switchMap, takeUntil } from 'rxjs';
import { OnBookingService } from '../../../../core/services/on-booking.service';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export default class StatisticsComponent implements OnInit {
  public eduSpaceId: string | null = null;
  public statistics$: any = null;
  constructor(
    private _route: ActivatedRoute,
    private _store: Store<AppState>,
    private _onBookingService: OnBookingService
  ) {}

  ngOnInit(): void {
    // Combina el observable del parámetro de la ruta y el observable del usuario autenticado
    this.statistics$ = combineLatest([
      this._route.paramMap,
      this._store.select(selectAuthUser),
    ]).pipe(
      switchMap(([params, user]) => {
        this.eduSpaceId = params.get('id');

        let filter = {};
        if (this.eduSpaceId && user) {
          filter = { eduSpaceId: this.eduSpaceId, teacherId: user.id };
        }
        return this._onBookingService.list(filter);
      })
    );
  }
}
