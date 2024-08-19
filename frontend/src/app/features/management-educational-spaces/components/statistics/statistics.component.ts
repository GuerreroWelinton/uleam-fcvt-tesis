import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import moment from 'moment';
import {
  combineLatest,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  BOOKING_STATES_MAT_SELECT,
  BOOKING_STATES_OPTIONS,
  DEFAULT_PAGE_SIZE,
} from '../../../../core/constants/component.constant';
import { USER_ROLES } from '../../../../core/enums/general.enum';
import { IBooking } from '../../../../core/interfaces/booking.interface';
import { IFilters } from '../../../../core/interfaces/general.interface';
import { ExcelService } from '../../../../core/services/excel.service';
import { OnBookingService } from '../../../../core/services/on-booking.service';
import { AppState } from '../../../../core/store';
import { selectAuthUser } from '../../../../core/store/user/user.selectors';
import { CustomizerSettingsService } from '../../../../shared/components/customizer-settings/customizer-settings.service';
import { BookingStatusFormatterPipe } from '../../../../shared/pipes/booking-status-formatter.pipe';
import { ISubject } from '../../../subjects/interfaces/subjects.interface';
import { SubjectsService } from '../../../subjects/services/subjects.service';
import { IUser } from '../../../users/interfaces/user.interface';
import { UsersService } from '../../../users/services/users.service';
import { DISPLAYED_COLUMNS_EDUCATIONAL_SPACES_STATISTICS } from '../../helpers/educational-spaces.constant';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    NgStyle,
    NgClass,
    BookingStatusFormatterPipe,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    MatPaginator,
    AsyncPipe,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export default class StatisticsComponent implements OnInit, AfterViewInit {
  private eduSpaceId: string | null = null;
  public eduSpaceName: string | null = null;

  @ViewChild(MatPaginator)
  public paginator: MatPaginator;
  public isLoading: boolean = false;
  public dataSource$: Observable<MatTableDataSource<any>> = of(
    new MatTableDataSource<any>([])
  );
  public displayedColumns: string[] =
    DISPLAYED_COLUMNS_EDUCATIONAL_SPACES_STATISTICS;

  private dataByExport: any[] = [];

  public totalCount: number = 0;
  public defaultPageSize = DEFAULT_PAGE_SIZE;
  private filter: IFilters = {
    page: 1,
    limit: DEFAULT_PAGE_SIZE[0],
  };

  public classApplied: boolean = false;
  public titlePopup: string = 'Filtros';

  public filterForm: FormGroup;
  public subjects$: Observable<ISubject[]> = of([]);

  public teachers$: Observable<IUser[]> = of([]);

  public baseStatesOptions = BOOKING_STATES_MAT_SELECT;

  constructor(
    public themeService: CustomizerSettingsService,
    private _route: ActivatedRoute,
    private _store: Store<AppState>,
    private _onBookingService: OnBookingService,
    private _excelService: ExcelService,
    private _router: Router,
    private _fb: FormBuilder,
    private _subjectService: SubjectsService,
    private _userService: UsersService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.initForm();
    this.subjects$ = this.fetchSubjects();
    this.teachers$ = this.fetchTeachers();
    this.dataSource$ = this.fetchBookingStatistics();
  }

  ngAfterViewInit(): void {
    this.dataSource$.pipe(
      tap((dataSource) => (dataSource.paginator = this.paginator))
    );
  }

  private initForm(): FormGroup {
    return this._fb.group({
      startTime: [''],
      endTime: [''],
      subjectId: [''],
      teacherId: [''],
      status: [''],
    });
  }

  private fetchSubjects(): Observable<ISubject[]> {
    return this._subjectService
      .list()
      .pipe(map((subjects) => subjects.data?.result || []));
  }

  private fetchTeachers(): Observable<IUser[]> {
    return this._userService
      .list({ roles: [USER_ROLES.TEACHER] }, { page: 1, limit: 100 })
      .pipe(map((teachers) => teachers.data?.result || []));
  }

  private fetchBookingStatistics(): Observable<MatTableDataSource<any>> {
    this.isLoading = true;
    return combineLatest([
      this._route.paramMap,
      this._store.select(selectAuthUser),
    ]).pipe(
      switchMap(([params, user]) => {
        this.eduSpaceId = params.get('id');
        this.eduSpaceName = params.get('name');

        if (this.eduSpaceId) {
          this.filter = { ...this.filter, eduSpaceId: this.eduSpaceId };
        }
        return this._onBookingService.list(this.filter).pipe(
          map((res) => {
            this.totalCount = res.data?.totalCount || 0;
            return this.transformBookingData(res.data?.result || []);
          }),
          finalize(() => (this.isLoading = false))
        );
      })
    );
  }

  private transformBookingData(bookings: IBooking[]): MatTableDataSource<any> {
    this.isLoading = false;
    const bookingMap = bookings.map(
      ({ startTime, endTime, status, subject, teacher, participants }) => {
        const date = moment(startTime).format('DD-MM-YYYY');
        const fStartTime = moment(startTime).format('HH:mm A');
        const fEndTime = moment(endTime).format('HH:mm A');
        const attendedCount = participants.filter((p) => p.attended).length;
        const notAttendedCount = participants.length - attendedCount;

        return {
          date,
          startTime: fStartTime,
          endTime: fEndTime,
          career: subject.career.name,
          subject: subject.name,
          teacher: `${teacher.name} ${teacher.lastName}`,
          number_participants: participants.length,
          attended_count: attendedCount,
          not_attended_count: notAttendedCount,
          status,
        };
      }
    );

    this.dataByExport = bookingMap.map((booking) => {
      return {
        ...booking,
        status: BOOKING_STATES_OPTIONS[booking.status].label,
      };
    });

    return new MatTableDataSource<any>(bookingMap || []);
  }

  public onPageChange($event: PageEvent): void {
    const { pageIndex, pageSize } = $event;
    this.filter = { ...this.filter, page: pageIndex + 1, limit: pageSize };
    this.dataSource$ = this.fetchBookingStatistics();
  }

  public exportToExcel(): void {
    const columnNames = {
      date: 'Fecha',
      startTime: 'Hora de inicio',
      endTime: 'Hora de fin',
      career: 'Carrera',
      subject: 'Materia',
      teacher: 'Profesor',
      number_participants: 'Participantes',
      attended_count: 'Asistieron',
      not_attended_count: 'No asistieron',
      status: 'Estado',
    };

    const fileName = `${this.eduSpaceName}_reservas.xlsx`;

    this._excelService.downloadExcel(this.dataByExport, columnNames, fileName);
  }

  public onBack(): void {
    this._router.navigate(['/management-bookings']);
  }

  public togglePopup(): void {
    this.classApplied = !this.classApplied;
  }

  public resetForm(): void {
    this.filterForm.patchValue({
      startTime: '',
      endTime: '',
      subjectId: '',
      teacherId: '',
      status: '',
    });
    this.filter = { page: 1, limit: DEFAULT_PAGE_SIZE[0] };
  }

  public onSubmit(): void {
    this.filter = {
      ...this.filter,
      ...this.filterForm.value,
      page: 1,
      limit: DEFAULT_PAGE_SIZE[0],
    };
    this.paginator.firstPage();
    this.totalCount = 0;
    this.dataSource$ = this.fetchBookingStatistics();
    this.togglePopup();
  }
}
