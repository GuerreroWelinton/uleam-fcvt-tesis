import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { map, Observable, of } from 'rxjs';
import { PreBookingService } from '../../../../core/services/pre-booking.service';
import { CardEducationalSpaceComponent } from '../../../../shared/components/card-educational-space/card-educational-space.component';
import { IEducationalSpace } from '../../../management-educational-spaces/interfaces/educational-spaces.interface';
import { ManagementEducationalSpacesService } from '../../../../core/services/management-educational-spaces.service';

@Component({
  selector: 'app-pre-booking',
  standalone: true,
  imports: [AsyncPipe, MatCardModule, CardEducationalSpaceComponent],
  templateUrl: './pre-booking.component.html',
})
export class PreBookingComponent implements OnInit {
  public eduSpaces$: Observable<IEducationalSpace[]> = of([]);

  constructor(
    private _eduSpacesService: ManagementEducationalSpacesService,
    private _preBookingService: PreBookingService
  ) {}

  ngOnInit() {
    this.eduSpaces$ = this.fetchEducationalSpaces();
  }

  private fetchEducationalSpaces(): Observable<IEducationalSpace[]> {
    return this._eduSpacesService
      .list()
      .pipe(map((res) => res.data?.result || []));
  }

  public onSelectedEduSpace(eduSpace: IEducationalSpace) {
    this.updateSelectedEduSpace(eduSpace);
  }

  private updateSelectedEduSpace(eduSpace: IEducationalSpace): void {
    this._preBookingService.updateSelectedEduSpace(eduSpace);
  }
}
