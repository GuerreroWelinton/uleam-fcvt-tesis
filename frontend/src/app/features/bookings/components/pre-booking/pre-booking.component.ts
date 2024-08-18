import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { map, Observable, of } from 'rxjs';
import { PreBookingService } from '../../../../core/services/pre-booking.service';
import { CardEducationalSpaceComponent } from '../../../../shared/components/card-educational-space/card-educational-space.component';
import { IEducationalSpace } from '../../../management-educational-spaces/interfaces/educational-spaces.interface';
import { ManagementEducationalSpacesService } from '../../../../core/services/management-educational-spaces.service';
import { EDU_SPACE_ACTIONS } from '../../../../core/enums/component.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-booking',
  standalone: true,
  imports: [AsyncPipe, MatCardModule, CardEducationalSpaceComponent],
  templateUrl: './pre-booking.component.html',
})
export class PreBookingComponent implements OnInit {
  public eduSpaces$: Observable<IEducationalSpace[]> = of([]);
  public eduSpaceActions = EDU_SPACE_ACTIONS;

  constructor(
    private _eduSpacesService: ManagementEducationalSpacesService,
    private _preBookingService: PreBookingService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.eduSpaces$ = this.fetchEducationalSpaces();
  }

  private fetchEducationalSpaces(): Observable<IEducationalSpace[]> {
    return this._eduSpacesService
      .list()
      .pipe(map((res) => res.data?.result || []));
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
    this._router.navigate(['/management-educational-spaces/service', id, name]);
  }
}
