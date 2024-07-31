import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FileUploadControl, FileUploadModule } from '@iplab/ngx-file-upload';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { catchError, map, Observable, of } from 'rxjs';
import { TEMPLATE_FILE_ROUTES } from '../../../../core/constants/general.constant';
import { BASE_RECORD_STATES } from '../../../../core/enums/general.enum';
import { ExcelService } from '../../../../core/services/excel.service';
import { FileUploadService } from '../../../../core/services/file-upload.service';
import { PreBookingService } from '../../../../core/services/pre-booking.service';
import { AppState } from '../../../../core/store';
import { selectAuthUser } from '../../../../core/store/user/user.selectors';
import { CustomizerSettingsService } from '../../../../shared/components/customizer-settings/customizer-settings.service';
import { DownloadFileDirective } from '../../../../shared/directives/download-file.directive';
import { ICareer } from '../../../careers/interfaces/careers.interface';
import { CareersService } from '../../../careers/services/careers.service';
import { IEducationalSpace } from '../../../management-educational-spaces/interfaces/educational-spaces.interface';
import { ISubject } from '../../../subjects/interfaces/subjects.interface';
import { SubjectsService } from '../../../subjects/services/subjects.service';
import { IUser } from '../../../users/interfaces/user.interface';
import { OnBookingService } from '../../../../core/services/on-booking.service';
import { DocumentsComponent } from '../documents/documents.component';
import { IBooking } from '../../../../core/interfaces/booking.interface';

@Component({
  selector: 'app-on-booking',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,

    FileUploadModule,
    FullCalendarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,

    DocumentsComponent,

    DownloadFileDirective,
  ],
  templateUrl: './on-booking.component.html',
})
export class OnBookingComponent implements OnInit {
  // FullCalendar
  public calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    firstDay: 1,
    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00',
    slotDuration: '00:30:00',
    handleWindowResize: true,
    allDaySlot: false,
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,timeGridDay',
    },
    businessHours: {
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      startTime: '07:00',
      endTime: '21:00',
    },
    selectable: true,
    events: [
      {
        title: 'Clase de Matemáticas',
        start: '2024-07-30T10:00:00',
        end: '2024-07-30T11:00:00',
        editable: true,
      },
    ],
    select: (arg) => this.openPopup(arg),
  };

  // POPUP
  public classApplied: boolean = false;

  // FORM
  public bookingForm: FormGroup;
  public careers: ICareer[] = [];
  public subjects: ISubject[] = [];
  private profile: IUser = {} as IUser;
  private selectedEduSpace: IEducationalSpace = {} as IEducationalSpace;
  private participants: { name: string }[] = [];
  private startTime: Date | null = null;
  private endTime: Date | null = null;

  //File
  public fileUploadControl: FileUploadControl;
  public templateFileUrl: string = TEMPLATE_FILE_ROUTES;
  public fileName: string = 'Template_participants.xlsx';

  public bookings$: Observable<IBooking[]> = of([]);

  constructor(
    public themeService: CustomizerSettingsService,
    private _store: Store<AppState>,
    private _formBuilder: FormBuilder,
    private _preBookingService: PreBookingService,
    private _careersService: CareersService,
    private _subjectsService: SubjectsService,
    private _fileUploadService: FileUploadService,
    private _excelService: ExcelService,
    private _onBookingService: OnBookingService
  ) {}

  ngOnInit(): void {
    // TODO: Inicializar los eventos del calendario
    this.bookings$ = this.fectchBookings();
    this.bookingForm = this.initializeForm();
    this.fileUploadControl = this._fileUploadService.createFileUploadControl();
    this.fetchProfile();
    this.fetchSelectedEducSpace();
    this.fetchCareers();
    this.fectchSubjects();
    this.fetchFile();
  }
  private fectchBookings(): Observable<IBooking[]> {
    return this._onBookingService.list().pipe(
      map((res) => res.data?.result ?? []),
      catchError(() => of([]))
    );
  }

  private fetchProfile(): void {
    this._store.select(selectAuthUser).subscribe((res) => {
      if (!res) return;
      this.profile = res;
    });
  }

  private fetchSelectedEducSpace(): void {
    this._preBookingService.getSelectedEduSpace().subscribe((res) => {
      if (!res) return;
      this.selectedEduSpace = res;
    });
  }

  private fetchCareers(): void {
    this._careersService
      .list()
      .pipe(
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

  private fectchSubjects() {
    this._subjectsService
      .list()
      .pipe(
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

  private initializeForm(): FormGroup {
    return this._formBuilder.group({
      date: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      teacher: ['', [Validators.required]],
      building: ['', [Validators.required]],
      eduSpace: ['', [Validators.required]],
      career: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      academicLevel: ['', [Validators.required]],
      number_participants: ['', [Validators.required]],
      topic: ['', [Validators.required]],
      observation: ['', [Validators.required]],
    });
  }

  private tooglePopup(): void {
    this.classApplied = !this.classApplied;
  }

  private openPopup(arg: DateSelectArg): void {
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
    this.tooglePopup();
  }

  public closePopup(): void {
    this.bookingForm.reset();
    this.fileUploadControl.clear();
    this.participants = [];
    this.tooglePopup();
  }

  public onChangeSubject($event: MatSelectChange): void {
    const { value } = $event;
    this.subjects.forEach((subject) => {
      if (subject.id === value) {
        this.bookingForm.patchValue({ academicLevel: subject.academicLevel });
      }
    });
  }

  public fetchFile(): void {
    this.fileUploadControl.valueChanges.subscribe((value) => {
      if (!value.length) {
        this.bookingForm.patchValue({ number_participants: '' });
        this.participants = [];
        return;
      }
      this._excelService
        .readExcel<{ participants: string }>(value, ['participants'])
        .then((res) => {
          res.forEach((participant) =>
            this.participants.push({ name: participant.participants })
          );
          this.bookingForm.patchValue({
            number_participants: this.participants.length,
          });
        });
    });
  }

  public onSubmit(): void {
    if (this.bookingForm.invalid || !this.fileUploadControl.value.length) {
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

  private afterSubmitForm(): void {
    // Reload the calendar data
    this.closePopup();
  }
}
