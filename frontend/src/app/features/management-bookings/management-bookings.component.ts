import { AsyncPipe, CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { FileUploadControl, FileUploadModule } from '@iplab/ngx-file-upload';
import { Store } from '@ngrx/store';
import { filter, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { ACTION_BUTTON_ADD, COMMON_TABLE_ACTIONS, DEFAULT_PAGE_SIZE, USER_ROLES_OPTIONS } from '../../core/constants/component.constant';
import { TABLE_ACTIONS } from '../../core/enums/component.enum';
import { IApiResponse } from '../../core/interfaces/api-response.interface';
import { IPagination, ITableAction } from '../../core/interfaces/component.interface';
import { AppState } from '../../core/store';
import { selectUserId } from '../../core/store/user/user.selectors';
import { CardEducationalSpaceComponent } from '../../shared/components/card-educational-space/card-educational-space.component';
import { CustomizerSettingsService } from '../../shared/components/customizer-settings/customizer-settings.service';
import { DownloadFileDirective } from '../../shared/directives/download-file.directive';
import { MaxCharDirective } from '../../shared/directives/max-char.directive';
import { MaxWidthEllipsisDirective } from '../../shared/directives/max-width-ellipsis.directive';
import { OnlyNumbersDirective } from '../../shared/directives/only-numbers.directive';
import { ShowForRolesDirective } from '../../shared/directives/show-for-roles.directive';
import { RoleFormatterPipe } from '../../shared/pipes/role-formatter.pipe';
import { StatusFormatterPipe } from '../../shared/pipes/status-formatter.pipe';
import { IEducationalSpace } from '../management-educational-spaces/interfaces/educational-spaces.interface';
import { ManagementEducationalSpacesService } from '../management-educational-spaces/services/management-educational-spaces.service';
import { ICalendar, ICalendarTable } from '../reservation/interfaces/calendar.interface';
import { ReservationsService } from '../reservation/services/reservations.service';
import { DISPLAYED_COLUMNS_USERS } from '../users/helpers/user.constant';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FormReservationComponent } from '../../shared/components/form-reservation/form-reservation.component';
import esLocale from "@fullcalendar/core/locales/es";

@Component({
  selector: 'app-management-bookings',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCardModule,
    MatTabsModule,
    CardEducationalSpaceComponent,

    CommonModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginator,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,

    DownloadFileDirective,
    FileUploadModule,
    MaxCharDirective,
    OnlyNumbersDirective,
    ShowForRolesDirective,
    MaxWidthEllipsisDirective,

    RoleFormatterPipe,
    StatusFormatterPipe,

    FullCalendarModule
  ],
  templateUrl: './management-bookings.component.html',
})
export default class ManagementBookingsComponent implements OnInit, AfterViewInit {
  public paginator: MatPaginator;

  public selectedEduSpace: IEducationalSpace | null = null;
  private userId$ = this._store.select(selectUserId);
  public eduSpaces$: Observable<IEducationalSpace[]> = of([]);

  public isLoading: boolean = false;
  public dataSource$: Observable<MatTableDataSource<ICalendarTable>> = of(
    new MatTableDataSource<ICalendarTable>([])
  );
  public activeActionbutton = ACTION_BUTTON_ADD;
  public userRoleOptions = USER_ROLES_OPTIONS;
  public displayColumns = DISPLAYED_COLUMNS_USERS;

  public titlePopup: string = '';
  public selectedUser: ICalendarTable | null = null;
  public classApplied: boolean = false;
  public totalCount: number = 0;
  public defaultPageSize = DEFAULT_PAGE_SIZE;
  private userPagination: IPagination = {
    page: 1,
    limit: DEFAULT_PAGE_SIZE[0],
  };
  private userFilters: Partial<ICalendar> = {};

  public fileUploadControl: FileUploadControl;

  calendarOptions: CalendarOptions = {
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
      right: 'timeGridWeek,timeGridDay' // user can switch between the two
    },
    businessHours: {
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      startTime: '07:00',
      endTime: '21:00',
    },
    selectable: true,
    select: (arg) => {
      this.openModal(arg)
    },
  };

  constructor(
    private _router: Router,
    private _store: Store<AppState>,
    private _educationalSpacesService: ManagementEducationalSpacesService,
    public themeService: CustomizerSettingsService,
    private _formBuilder: FormBuilder,
    private _reservationService: ReservationsService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.eduSpaces$ = this.fetchEducationalSpaces();
    this.dataSource$ = this.fetchReservationData();
    this.reservationForm = this.setReservationForm(this.activeActionbutton);
  }

  ngAfterViewInit(): void {
    this.dataSource$.pipe(
      tap((dataSource) => (dataSource.paginator = this.paginator))
    );
  }

  public onPageChange($event: PageEvent): void {
    const { pageIndex, pageSize } = $event;
    this.userPagination = { page: pageIndex + 1, limit: pageSize };
    this.dataSource$ = this.fetchReservationData();
  }

  private fetchReservationData(): Observable<MatTableDataSource<ICalendarTable>> {
    this.isLoading = true;
    return this._reservationService.list(this.userFilters, this.userPagination).pipe(
      map((res) => this.transformReservationData(res)),
      finalize(() => (this.isLoading = false))
    );
  }

  //BUTTONS
  public onActionButton(
    actionButton: ITableAction,
    element: ICalendarTable | null
  ): void {
    this.initializeFormForAction(actionButton, element);
    this.populateFormWithUserData(actionButton, element);
    this.togglePopup();
  }

  public reservationForm: FormGroup;

  private initializeFormForAction(
    actionButton: ITableAction,
    element: ICalendarTable | null
  ): void {
    this.activeActionbutton = actionButton;
    this.titlePopup = actionButton.label;
    this.selectedUser = element;
    this.reservationForm = this.setReservationForm(actionButton);
  }

  private transformReservationData(
    res: IApiResponse<ICalendar[]>
  ): MatTableDataSource<ICalendarTable> {
    const users = res.data?.result || [];
    const usersWithAction = users.map((user) => ({
      ...user,
      actions: COMMON_TABLE_ACTIONS,
    }));
    this.totalCount = res.data?.totalCount || 0;
    return new MatTableDataSource<ICalendarTable>(usersWithAction);
  }

  private togglePopup(): void {
    this.classApplied = !this.classApplied;
  }

  public populateFormWithUserData(
    buttonActive: ITableAction,
    rowSelected: ICalendarTable | null
  ): void {
    if (
      buttonActive.name === TABLE_ACTIONS.ADD ||
      buttonActive.name === TABLE_ACTIONS.ADD_GROUP ||
      !rowSelected
    ) {
      return;
    }

    const { date, start_hour, end_hour, teacher, students_count, observation } = rowSelected;
    this.reservationForm.patchValue({
      date,
      start_hour,
      end_hour,
      teacher,
      students_count,
      observation,
    });

    this.toggleFormState(buttonActive);

    // this.updateRoleOptionsBasedOnSelection(roles);
  }

  //FORM
  public setReservationForm(buttonActive: ITableAction): FormGroup {
    const formConfig = this.getFormConfigByAction(buttonActive);
    return this._formBuilder.group(formConfig);
  }

  // private updateRoleOptionsBasedOnSelection(roles: USER_ROLES[]): void {
  //   const { isStudentSelected, areAdminSupervisorTeacherSelected } =
  //     this.checkRoleSelection(roles);

  //   this.userRoleOptions.forEach((option) => {
  //     if (option.value === USER_ROLES.STUDENT) {
  //       option.enabled = !areAdminSupervisorTeacherSelected;
  //     } else {
  //       option.enabled = !isStudentSelected;
  //     }
  //   });
  // }

  // private checkRoleSelection(selectedValues: USER_ROLES[]): {
  //   isStudentSelected: boolean;
  //   areAdminSupervisorTeacherSelected: boolean;
  // } {
  //   const isStudentSelected = selectedValues.includes(USER_ROLES.STUDENT);
  //   const areAdminSupervisorTeacherSelected = selectedValues.some((role) =>
  //     [USER_ROLES.ADMIN, USER_ROLES.SUPERVISOR, USER_ROLES.TEACHER].includes(
  //       role
  //     )
  //   );
  //   return { isStudentSelected, areAdminSupervisorTeacherSelected };
  // }

  private toggleFormState(buttonActive: ITableAction): void {
    buttonActive.name === TABLE_ACTIONS.VIEW
      ? this.reservationForm.disable()
      : this.reservationForm.enable();

    if (buttonActive.name === TABLE_ACTIONS.EDIT) {
      this.reservationForm.get('email')?.disable();
    }
  }

  private getFormConfigByAction(buttonActive: ITableAction): {} {
    const defaultConfig = {
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(10)]],
      roles: ['', [Validators.required]],
    };

    const addConfig = {
      ...defaultConfig,
      password: ['', [Validators.required]],
    };

    const addGroupConfig = {
      roles: ['', [Validators.required]],
    };

    const viewAndEditConfig = {
      ...defaultConfig,
      status: ['', [Validators.required]],
    };

    const actionMap = new Map<TABLE_ACTIONS, {}>([
      [TABLE_ACTIONS.ADD, addConfig],
      [TABLE_ACTIONS.ADD_GROUP, addGroupConfig],
      [TABLE_ACTIONS.VIEW, viewAndEditConfig],
      [TABLE_ACTIONS.EDIT, viewAndEditConfig],
      [TABLE_ACTIONS.DELETE, {}],
    ]);

    return actionMap.get(buttonActive.name) || {};
  }

  public closePopup(): void {
    this.reservationForm.reset();
    // this.activeTabIndex = 0;
    this.selectedUser = null;
    // this.resetUserRoleOptions();
    this.togglePopup();
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

  public onSubmit(): void {
    if (this.reservationForm.invalid) return;
    // const actionHandler = this.getActionHandlerByButton(
    //   this.activeActionbutton
    // );
    // actionHandler();
  }


  public openModal(arg: any) {
    const dialogRef = this.dialog.open(FormReservationComponent, {
      width: '50%',
      data: arg,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('Dialog result:', result);
    });
    // this.classApplied = !this.classApplied;
  }

}
