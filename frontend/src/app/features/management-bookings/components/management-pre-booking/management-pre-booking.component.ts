import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, Observable, of, switchMap } from 'rxjs';
import { EDU_SPACE_ACTIONS } from '../../../../core/enums/component.enum';
import { ManagementEducationalSpacesService } from '../../../../core/services/management-educational-spaces.service';
import { PreBookingService } from '../../../../core/services/pre-booking.service';
import { AppState } from '../../../../core/store';
import { selectUserId } from '../../../../core/store/user/user.selectors';
import { CardEducationalSpaceComponent } from '../../../../shared/components/card-educational-space/card-educational-space.component';
import { IEducationalSpace } from '../../../management-educational-spaces/interfaces/educational-spaces.interface';

@Component({
  selector: 'app-management-pre-booking',
  standalone: true,
  imports: [AsyncPipe, MatCardModule, CardEducationalSpaceComponent],
  templateUrl: './management-pre-booking.component.html',
})
export class ManagementPreBookingComponent implements OnInit {
  public eduSpaces$: Observable<IEducationalSpace[]> = of([]);
  public eduSpaceActions = EDU_SPACE_ACTIONS;
  private userId$ = this._store.select(selectUserId);

  constructor(
    private _store: Store<AppState>,
    private _preBookingService: PreBookingService,
    private _eduSpacesService: ManagementEducationalSpacesService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.eduSpaces$ = this.fetchEducationalSpaces();
  }

  private fetchEducationalSpaces(): Observable<IEducationalSpace[]> {
    return this.userId$.pipe(
      filter((userId) => userId !== undefined),
      switchMap((userId) =>
        this._eduSpacesService.listByUserId(userId!).pipe(
          map((res) => {
            return res.data?.result || [];
          })
        )
      )
    );
  }

  public onSelectedEduSpace(
    eduSpace: IEducationalSpace,
    action: EDU_SPACE_ACTIONS
  ): void {
    if (action === EDU_SPACE_ACTIONS.SEE_CALENDAR) {
      this.updateSelectedEduSpace(eduSpace);
    }

    if (action === EDU_SPACE_ACTIONS.SEE_STATISTICS) {
      this.openEduSpaceStats(eduSpace);
    }
  }

  private updateSelectedEduSpace(eduSpace: IEducationalSpace): void {
    this._preBookingService.updateSelectedEduSpace(eduSpace);
  }

  private openEduSpaceStats(eduSpace: IEducationalSpace): void {
    const { id, name } = eduSpace;
    this._router.navigate(['/management-educational-spaces', id, name]);
  }
}
