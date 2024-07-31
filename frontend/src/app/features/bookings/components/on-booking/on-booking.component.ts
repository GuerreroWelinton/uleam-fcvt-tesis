import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable, of } from 'rxjs';
import { PopupContainerService } from '../../../../core/services/popup-container.service';
import { CalendarComponent } from '../calendar/calendar.component';
import { DocumentsComponent } from '../documents/documents.component';
import { ListComponent } from '../list/list.component';
import { ManagementDocumentsComponent } from '../../../management-bookings/components/management-documents/management-documents.component';

@Component({
  selector: 'app-on-booking',
  standalone: true,
  imports: [
    AsyncPipe,
    NgTemplateOutlet,

    MatCardModule,
    MatTabsModule,

    CalendarComponent,
    ListComponent,
    DocumentsComponent,
    ManagementDocumentsComponent,
  ],
  templateUrl: './on-booking.component.html',
})
export class OnBookingComponent implements OnInit {
  // POPUP
  public classApplied$: Observable<boolean> = of(false);
  public template$: Observable<TemplateRef<HTMLElement> | null> = of(null);

  constructor(private _popupContainerService: PopupContainerService) {}

  ngOnInit(): void {
    this.classApplied$ = this.tooglePopup();
    this.template$ = this.getTemplate();
  }

  public tooglePopup(): Observable<boolean> {
    return this._popupContainerService.getTooglePopup();
  }

  public getTemplate(): Observable<TemplateRef<HTMLElement> | null> {
    return this._popupContainerService.getShowTemplate();
  }
}
