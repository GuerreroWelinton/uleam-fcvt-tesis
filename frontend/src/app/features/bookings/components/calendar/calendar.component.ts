import { CommonModule, JsonPipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import {
  CalendarOptions,
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventSourceInput,
} from '@fullcalendar/core';
import { FileUploadControl, FileUploadModule } from '@iplab/ngx-file-upload';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { catchError, map, Observable, of, Subject, takeUntil } from 'rxjs';
import {
  BASE_CALENDAR_OPTIONS,
  BOOKING_STATES_OPTIONS,
} from '../../../../core/constants/component.constant';
import { TEMPLATE_FILE_ROUTES } from '../../../../core/constants/general.constant';
import {
  BASE_RECORD_STATES,
  BOOKING_STATES,
} from '../../../../core/enums/general.enum';
import { IBooking } from '../../../../core/interfaces/booking.interface';
import { IFilters } from '../../../../core/interfaces/general.interface';
import { ExcelService } from '../../../../core/services/excel.service';
import { FileUploadService } from '../../../../core/services/file-upload.service';
import { OnBookingService } from '../../../../core/services/on-booking.service';
import { PopupContainerService } from '../../../../core/services/popup-container.service';
import { PreBookingService } from '../../../../core/services/pre-booking.service';
import { AppState } from '../../../../core/store';
import { selectAuthUser } from '../../../../core/store/user/user.selectors';
import { DownloadFileDirective } from '../../../../shared/directives/download-file.directive';
import { ICareer } from '../../../careers/interfaces/careers.interface';
import { CareersService } from '../../../careers/services/careers.service';
import { IEducationalSpace } from '../../../management-educational-spaces/interfaces/educational-spaces.interface';
import { ISubject } from '../../../subjects/interfaces/subjects.interface';
import { SubjectsService } from '../../../subjects/services/subjects.service';
import { IUser } from '../../../users/interfaces/user.interface';
import { InfoCalendarComponent } from '../../../../shared/components/info-calendar/info-calendar.component';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FullCalendarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    FileUploadModule,
    DownloadFileDirective,
    JsonPipe,
    InfoCalendarComponent,
    MatListModule,
    MatCheckboxModule,
  ],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit, OnDestroy {
  // POPUP
  @ViewChild('popupTemplate', { static: true })
  public popupTemplate: TemplateRef<HTMLElement> | null = null;

  @ViewChild('assistanceTemplate', { static: true })
  public assistanceTemplate: TemplateRef<HTMLElement> | null = null;

  // FULLCALENDAR
  @ViewChild('calendar')
  public calendarComponent: FullCalendarComponent;
  public calendarOptions = BASE_CALENDAR_OPTIONS;
  public selectedBooking: IBooking | null = null;
  public filters: IFilters = {};
  private bookings: IBooking[] = [];

  // FROM
  public bookingForm: FormGroup;
  public assistenceForm: FormGroup;
  public bookingStates = BOOKING_STATES;
  public bookingStatesOptions = BOOKING_STATES_OPTIONS;
  public selectedEduSpace$: Observable<IEducationalSpace | null> = of(null);

  // AUX
  private unsubscribe$ = new Subject<boolean>();

  //OTHERS
  private profile: IUser | null = null;
  private selectedEduSpace: IEducationalSpace | null = null;
  private startTime: Date | null = null;
  private endTime: Date | null = null;
  public careers: ICareer[] = [];

  public subjects: ISubject[] = [];

  public fileUploadControl: FileUploadControl;
  public templateFileUrl: string = TEMPLATE_FILE_ROUTES;
  public fileName: string = 'Template_participants.xlsx';
  private participants: { identityDocument: string }[] = [];
  public bookingParticipants: { userId: IUser; attended: boolean }[] = [];

  constructor(
    private _popupContainerService: PopupContainerService,
    private _preBookingService: PreBookingService,
    private _onBookingService: OnBookingService,
    private _store: Store<AppState>,
    private _careersService: CareersService,
    private _formBuilder: FormBuilder,
    private _excelService: ExcelService,
    private _fileUploadService: FileUploadService,
    private _subjectsService: SubjectsService,
    private _alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.fileUploadControl = this.setUploadControl();
    this.calendarOptions = this.setCalendarOptions();
    this.bookingForm = this.initializeForm();
    this.assistenceForm = this.initializeFormAssistence();
    this.fetchProfile();
    this.fetchSelectedEducSpace();
    this.fetchCareers();
    this.fectchSubjects();
    this.fetchFile();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  private setUploadControl(): FileUploadControl {
    return this._fileUploadService.createFileUploadControl();
  }

  private setCalendarOptions(): CalendarOptions {
    return {
      ...this.calendarOptions,
      selectable: true,
      editable: true,
      eventClick: this.handleClickEvent.bind(this),
      select: this.handleSelect.bind(this),
      datesSet: this.handleDatesSet.bind(this),
    };
  }

  public handleClickEvent(arg: EventClickArg): void {
    if (!this.assistanceTemplate || !this.profile) return;
    const { event } = arg;
    const booking = this.bookings.find((b) => b.id === event.id);
    if (!booking) return;
    if (booking.status !== BOOKING_STATES.APPROVED) return;
    if (booking.teacher.id !== this.profile.id) return;
    this.selectedBooking = booking;
    this.bookingParticipants = booking.participants;
    this.setParticipants(this.bookingParticipants);
    this.showPopup(this.assistanceTemplate);
  }

  private setParticipants(
    participants: { userId: IUser; attended: boolean }[]
  ): void {
    const participantsFormArray = this.assistenceForm.get(
      'participants'
    ) as FormArray;
    participantsFormArray.clear();
    participants.forEach(({ userId, attended }) => {
      participantsFormArray.push(this._formBuilder.group({ userId, attended }));
    });
  }

  private handleSelect(arg: DateSelectArg): void {
    if (!this.profile || !this.selectedEduSpace || !this.popupTemplate) {
      return;
    }

    const { startStr, endStr } = arg;
    this.startTime = arg.start;
    this.endTime = arg.end;
    const date = moment(startStr).format('DD-MM-YYYY');
    const startTime = moment(startStr).format('HH:mm A');
    const endTime = moment(endStr).format('HH:mm A');

    this.bookingForm.patchValue({
      date,
      startTime,
      endTime,
      teacher: this.profile.name + ' ' + this.profile.lastName,
      building: this.selectedEduSpace.building.name,
      eduSpace: this.selectedEduSpace.name,
    });

    this.showPopup(this.popupTemplate);
  }

  private handleDatesSet(arg: DatesSetArg): void {
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
    if (!this.selectedEduSpace) {
      return;
    }
    this.filters = { eduSpaceId: this.selectedEduSpace.id, ...this.filters };

    this._onBookingService
      .list(this.filters)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.bookings = res.data?.result || [];

        this.calendarOptions.events = this.setEvents(this.bookings);
      });
  }

  private setEvents(bookings: IBooking[]): EventSourceInput {
    return bookings.map((booking) => ({
      id: booking.id,
      title: booking.subject.name,
      start: booking.startTime,
      end: booking.endTime,
      backgroundColor: BOOKING_STATES_OPTIONS[booking.status].color,
      borderColor: BOOKING_STATES_OPTIONS[booking.status].color,
    }));
  }

  private initializeForm(): FormGroup {
    return this._formBuilder.group({
      date: [{ value: '', disabled: true }, [Validators.required]],
      startTime: [{ value: '', disabled: true }, [Validators.required]],
      endTime: [{ value: '', disabled: true }, [Validators.required]],
      teacher: [{ value: '', disabled: true }, [Validators.required]],
      building: [{ value: '', disabled: true }, [Validators.required]],
      eduSpace: [{ value: '', disabled: true }, [Validators.required]],
      career: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      academicLevel: [{ value: '', disabled: true }, [Validators.required]],
      number_participants: [
        { value: '', disabled: true },
        [Validators.required],
      ],
      topic: ['', [Validators.required]],
      observation: ['', [Validators.required]],
    });
  }

  private initializeFormAssistence(): FormGroup {
    return this._formBuilder.group({
      participants: this._formBuilder.array([]),
    });
  }

  private fetchProfile(): void {
    this._store
      .select(selectAuthUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.profile = res;
      });
  }

  private fetchSelectedEducSpace(): void {
    this._preBookingService
      .getSelectedEduSpace()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.selectedEduSpace = res;
      });
  }

  private fetchCareers(): void {
    this._careersService
      .list()
      .pipe(
        takeUntil(this.unsubscribe$),
        map((res) => res.data?.result ?? []),
        map((careers) =>
          careers.filter(
            (career) => career.status === BASE_RECORD_STATES.ACTIVE
          )
        ),
        catchError(() => of([]))
      )
      .subscribe((res) => (this.careers = res));
  }

  // todo: cargarlas dependiendo de la carrera que se selecciona queda pendiente el filtro en el back y front
  private fectchSubjects() {
    this._subjectsService
      .list()
      .pipe(
        takeUntil(this.unsubscribe$),
        map((res) => res.data?.result ?? []),
        map((subjects) =>
          subjects.filter(
            (subject) => subject.status === BASE_RECORD_STATES.ACTIVE
          )
        ),
        catchError(() => of([]))
      )
      .subscribe((res) => (this.subjects = res));
  }

  private fetchFile(): void {
    this.fileUploadControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (!value.length) {
          this.bookingForm.patchValue({ number_participants: '' });
          this.participants = [];
          return;
        }
        this._excelService
          .readExcel<{ participants: string | number }>(value, ['participants'])
          .then((res) => {
            const newParticipants = res.map((participant) => ({
              identityDocument: participant.participants.toString(),
            }));

            const identityDocuments = newParticipants.map(
              (p) => p.identityDocument
            );
            const uniqueIdentityDocuments = new Set(identityDocuments);

            if (identityDocuments.length !== uniqueIdentityDocuments.size) {
              this._alertService.showAlert({
                type: 'info',
                message:
                  'Algunos participantes tienen documentos de identidad duplicados. Por favor, revisa el archivo y elimina los duplicados antes de volver a cargarlo.',
              });
              return;
            }

            this.participants = newParticipants;
            this.bookingForm.patchValue({
              number_participants: this.participants.length,
            });
          });
      });
  }

  public onSubmit(): void {
    if (
      this.bookingForm.invalid ||
      !this.fileUploadControl.value.length ||
      !this.profile ||
      !this.selectedEduSpace
    ) {
      return;
    }

    const { subject, topic, observation } = this.bookingForm.value;
    const data = {
      startTime: this.startTime,
      endTime: this.endTime,
      teacherId: this.profile.id,
      eduSpaceId: this.selectedEduSpace.id,
      subjectId: subject,
      topic,
      observation,
      participants: this.participants,
    };
    this.onAddBooking(data);
  }

  private onAddBooking(data: object): void {
    this._onBookingService
      .register(data)
      .subscribe(() => this.afterSubmitForm());
  }

  public onSubmitAssistence(): void {
    if (this.assistenceForm.invalid || !this.selectedBooking) return;
    const { id } = this.selectedBooking;
    const { participants } = this.assistenceForm.value;
    this._onBookingService
      .update(id, { participants, status: BOOKING_STATES.CONFIRMED })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.afterSubmitForm();
      });
  }

  private afterSubmitForm(): void {
    this.fetchBookings();
    this.hidePopup();
  }

  public onChangeSubject($event: MatSelectChange): void {
    const { value } = $event;
    this.subjects.forEach((subject) => {
      if (subject.id === value) {
        this.bookingForm.patchValue({ academicLevel: subject.academicLevel });
      }
    });
  }

  public showPopup(template: TemplateRef<HTMLElement>): void {
    this._popupContainerService.showTemplate(template);
    this._popupContainerService.tooglePopup(true);
  }

  public hidePopup() {
    this.fileUploadControl.clear();
    this.bookingForm.reset();
    this._popupContainerService.showTemplate(null);
    this._popupContainerService.tooglePopup(false);
  }
}
