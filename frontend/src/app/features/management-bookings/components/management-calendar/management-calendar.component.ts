import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import {
  CalendarOptions,
  DatesSetArg,
  EventClickArg,
  EventSourceInput,
} from '@fullcalendar/core';
import moment from 'moment';
import { filter, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import {
  BASE_CALENDAR_OPTIONS,
  BOOKING_STATES_OPTIONS,
} from '../../../../core/constants/component.constant';
import { BOOKING_STATES } from '../../../../core/enums/general.enum';
import { IBooking } from '../../../../core/interfaces/booking.interface';
import { IFilters } from '../../../../core/interfaces/general.interface';
import { OnBookingService } from '../../../../core/services/on-booking.service';
import { PopupContainerService } from '../../../../core/services/popup-container.service';
import { PreBookingService } from '../../../../core/services/pre-booking.service';
import { IEducationalSpace } from '../../../management-educational-spaces/interfaces/educational-spaces.interface';
import { InfoCalendarComponent } from '../../../../shared/components/info-calendar/info-calendar.component';

//todo: refactor
import 'moment/locale/es';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ReportService } from '../../../../core/services/report.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-management-calendar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FullCalendarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    InfoCalendarComponent,
  ],
  templateUrl: './management-calendar.component.html',
})
export class ManagementCalendarComponent implements OnInit, OnDestroy {
  // POPUP
  @ViewChild('popupTemplate', { static: true })
  public popupTemplate: TemplateRef<HTMLElement> | null = null;

  // FULLCALENDAR
  @ViewChild('calendar')
  public calendarComponent: FullCalendarComponent;
  public calendarOptions = BASE_CALENDAR_OPTIONS;
  public selectedBooking: IBooking = {} as IBooking;
  public filters: IFilters = {};
  private bookings: IBooking[] = [];

  // FROM
  public bookingForm: FormGroup;
  public bookingStates = BOOKING_STATES;
  public bookingStatesOptions = BOOKING_STATES_OPTIONS;
  public selectedEduSpace$: Observable<IEducationalSpace | null> = of(null);

  // AUX
  private unsubscribe$ = new Subject<boolean>();

  constructor(
    private _popupContainerService: PopupContainerService,
    private _preBookingService: PreBookingService,
    private _onBookingService: OnBookingService,
    private _formBuilder: FormBuilder,
    private _reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.calendarOptions = this.setCalendarOptions();
    this.bookingForm = this.initializeForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  // FULLCALENDAR
  private setCalendarOptions(): CalendarOptions {
    return {
      ...this.calendarOptions,
      selectable: false,
      editable: false,
      eventClick: this.handleClickEvent.bind(this),
      datesSet: this.handleDatesSet.bind(this),
    };
  }

  private handleClickEvent(arg: EventClickArg) {
    const { event } = arg;
    const booking = this.bookings.find((b) => b.id === event.id);
    if (!booking) return;
    this.selectedBooking = booking;
    this.populateForm(this.selectedBooking);
    this.showPopup();
  }

  private handleDatesSet(arg: DatesSetArg) {
    const { start, end } = arg;
    this.filters = {
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: [
        BOOKING_STATES.PENDING,
        BOOKING_STATES.APPROVED,
        BOOKING_STATES.CONFIRMED,
      ],
    };
    this.fetchBookings();
  }

  private fetchBookings(): void {
    this._preBookingService
      .getSelectedEduSpace()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((selectedEduSpace) => !!selectedEduSpace),
        switchMap((selectedEduSpace) => {
          this.filters = { eduSpaceId: selectedEduSpace!.id, ...this.filters };
          return this._onBookingService.list(this.filters);
        })
      )
      .subscribe((bookingsList) => {
        this.bookings = bookingsList.data?.result || [];
        this.calendarOptions.events = this.setEvents(this.bookings);
      });
  }

  private setEvents(bookings: IBooking[]): EventSourceInput {
    return (
      bookings
        // .filter((booking) => booking.status !== BOOKING_STATES.REJECTED)
        .map((booking) => ({
          id: booking.id,
          title: booking.subject.name,
          start: booking.startTime,
          end: booking.endTime,
          backgroundColor: BOOKING_STATES_OPTIONS[booking.status].color,
          borderColor: BOOKING_STATES_OPTIONS[booking.status].color,
        }))
    );
  }

  // FORM
  private initializeForm(): FormGroup {
    return this._formBuilder.group({
      date: [{ value: '', disabled: true }, , [Validators.required]],
      startTime: [{ value: '', disabled: true }, , [Validators.required]],
      endTime: [{ value: '', disabled: true }, , [Validators.required]],
      teacher: [{ value: '', disabled: true }, , [Validators.required]],
      building: [{ value: '', disabled: true }, , [Validators.required]],
      eduSpace: [{ value: '', disabled: true }, , [Validators.required]],
      career: [{ value: '', disabled: true }, , [Validators.required]],
      subject: [{ value: '', disabled: true }, , [Validators.required]],
      academicLevel: [{ value: '', disabled: true }, , [Validators.required]],
      number_participants: [
        { value: '', disabled: true },
        [Validators.required],
      ],
      topic: [{ value: '', disabled: true }, , [Validators.required]],
      observation: [{ value: '', disabled: true }, , [Validators.required]],
      status: [{ value: '', disabled: true }, , [Validators.required]],
    });
  }

  private populateForm(booking: IBooking): void {
    const { startTime, endTime } = booking;

    const date = moment(startTime).format('DD-MM-YYYY');
    const startTimeFormat = moment(startTime).format('HH:mm A');
    const endTimeFormat = moment(endTime).format('HH:mm A');

    this.bookingForm.patchValue({
      date: date,
      startTime: startTimeFormat,
      endTime: endTimeFormat,
      teacher: `${booking.teacher.name} ${booking.teacher.lastName}`,
      building: booking.eduSpace.building.name,
      eduSpace: booking.eduSpace.name,
      career: booking.subject.career.name,
      subject: booking.subject.name,
      academicLevel: booking.subject.academicLevel,
      number_participants: booking.participants.length,
      topic: booking.topic,
      observation: booking.observation,
      status: this.bookingStatesOptions[booking.status].label,
    });
  }

  public approveBooking(): void {
    if (this.bookingForm.invalid) return;
    const { id } = this.selectedBooking;
    this._onBookingService
      .update(id, { status: BOOKING_STATES.APPROVED })
      .subscribe(() => this.afterSubmitForm());
  }

  public rejectBooking(): void {
    if (this.bookingForm.invalid) return;
    const { id } = this.selectedBooking;
    this._onBookingService
      .update(id, { status: BOOKING_STATES.REJECTED })
      .subscribe(() => this.afterSubmitForm());
  }

  private afterSubmitForm(): void {
    this.hidePopup();
    this.fetchBookings();
  }

  // POPUP
  public showPopup() {
    this._popupContainerService.showTemplate(this.popupTemplate);
    this._popupContainerService.tooglePopup(true);
  }

  public hidePopup() {
    this._popupContainerService.showTemplate(null);
    this._popupContainerService.tooglePopup(false);
  }

  // REPORT
  //todo: refactor
  public generateReport() {
    const imageUrl = 'assets/images/cabecera.png';
    this._reportService
      .generateReport(this.selectedBooking, imageUrl)
      .then(() => {
        const pdfDocument = this._reportService.getPdfDocument();
        pdfDocument.open();
      });
  }
}
