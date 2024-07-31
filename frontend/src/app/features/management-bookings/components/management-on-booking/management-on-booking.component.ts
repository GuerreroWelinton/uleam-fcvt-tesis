import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable, of } from 'rxjs';
import { PopupContainerService } from '../../../../core/services/popup-container.service';
import { ManagementCalendarComponent } from '../management-calendar/management-calendar.component';
import { ManagementDocumentsComponent } from '../management-documents/management-documents.component';
import { ManagementListComponent } from '../management-list/management-list.component';

@Component({
  selector: 'app-management-on-booking',
  standalone: true,
  imports: [
    AsyncPipe,
    NgTemplateOutlet,

    MatCardModule,
    MatTabsModule,

    ManagementCalendarComponent,
    ManagementListComponent,
    ManagementDocumentsComponent,
  ],
  templateUrl: './management-on-booking.component.html',
})
export class ManagementOnBookingComponent implements OnInit {
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
