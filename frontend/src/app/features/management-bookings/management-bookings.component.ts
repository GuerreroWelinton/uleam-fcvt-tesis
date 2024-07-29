import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { AppState } from '../../core/store';
import { selectUserId } from '../../core/store/user/user.selectors';
import { IEducationalSpace } from '../management-educational-spaces/interfaces/educational-spaces.interface';
import { ManagementEducationalSpacesService } from '../management-educational-spaces/services/management-educational-spaces.service';

@Component({
  selector: 'app-management-bookings',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './management-bookings.component.html',
})
export default class ManagementBookingsComponent implements OnInit {
  private userId$ = this._store.select(selectUserId);
  public eduSpaces$: Observable<IEducationalSpace[]> = of([]);

  constructor(
    private _store: Store<AppState>,
    private _educationalSpacesService: ManagementEducationalSpacesService
  ) {}

  ngOnInit(): void {
    this.eduSpaces$ = this.fetchEducationalSpaces();
  }

  public fetchEducationalSpaces(): Observable<IEducationalSpace[]> {
    return this.userId$.pipe(
      filter((userId) => userId !== undefined),
      switchMap((userId) =>
        this._educationalSpacesService.listByUserId(userId!).pipe(
          map((res) => {
            return res.data?.result || [];
          })
        )
      )
    );
  }
}
