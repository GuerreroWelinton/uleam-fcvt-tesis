import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, Observable, of, switchMap } from 'rxjs';
import { AppState } from '../../core/store';
import { selectUserId } from '../../core/store/user/user.selectors';
import { CardEducationalSpaceComponent } from '../../shared/components/card-educational-space/card-educational-space.component';
import { IEducationalSpace } from '../management-educational-spaces/interfaces/educational-spaces.interface';
import { ManagementEducationalSpacesService } from '../management-educational-spaces/services/management-educational-spaces.service';

@Component({
  selector: 'app-management-bookings',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCardModule,
    MatTabsModule,
    CardEducationalSpaceComponent,
  ],
  templateUrl: './management-bookings.component.html',
})
export default class ManagementBookingsComponent implements OnInit {
  public selectedEduSpace: IEducationalSpace | null = null;
  private userId$ = this._store.select(selectUserId);
  public eduSpaces$: Observable<IEducationalSpace[]> = of([]);

  constructor(
    private _router: Router,
    private _store: Store<AppState>,
    private _educationalSpacesService: ManagementEducationalSpacesService
  ) {}

  ngOnInit(): void {
    this.eduSpaces$ = this.fetchEducationalSpaces();
  }

  private fetchEducationalSpaces(): Observable<IEducationalSpace[]> {
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

  public onSelectedEduSpace(eduSpace: IEducationalSpace): void {
    this.selectedEduSpace = eduSpace;
  }
}
