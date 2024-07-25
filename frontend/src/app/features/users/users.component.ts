import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileUploadControl, FileUploadModule } from '@iplab/ngx-file-upload';
import { finalize, map, Observable, of, tap } from 'rxjs';
import {
  ACTION_BUTTON_ADD,
  ACTION_BUTTON_ADD_GROUP,
  BASE_STATES_MAT_SELECT,
  COMMON_TABLE_ACTIONS,
  DEFAULT_PAGE_SIZE,
  USER_ROLES_OPTIONS,
} from '../../core/constants/component.constant';
import { TEMPLATE_FILE_ROUTES } from '../../core/constants/general.constant';
import { TABLE_ACTIONS } from '../../core/enums/component.enum';
import {
  IPagination,
  ITableAction,
} from '../../core/interfaces/component.interface';
import { DataComparisonService } from '../../core/services/data-comparison.service';
import { ExcelService } from '../../core/services/excel.service';
import { FileUploadService } from '../../core/services/file-upload.service';
import { convertToSchemaType } from '../../core/utils/general.util';
import { CustomizerSettingsService } from '../../shared/components/customizer-settings/customizer-settings.service';
import { DownloadFileDirective } from '../../shared/directives/download-file.directive';
import { MaxCharDirective } from '../../shared/directives/max-char.directive';
import { OnlyNumbersDirective } from '../../shared/directives/only-numbers.directive';
import { ShowForRolesDirective } from '../../shared/directives/show-for-roles.directive';
import { StatusFormatterPipe } from '../../shared/pipes/status-formatter.pipe';
import {
  DISPLAYED_COLUMNS_USERS,
  EXPECTED_HEADERS_XLSX_USERS,
  FILE_NAME_USERS,
  KEYS_TO_UPDATE_USER,
  USER_SCHEMA,
} from './helpers/user.constant';
import { IUser, IUserTable } from './interfaces/user.interface';
import { UsersService } from './service/users.service';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { USER_ROLES } from '../../core/enums/general.enum';
import { IApiResponse } from '../../core/interfaces/api-response.interface';
import { TokenService } from '../../core/services/token.service';
import { MaxWidthEllipsisDirective } from '../../shared/directives/max-width-ellipsis.directive';
import { RoleFormatterPipe } from '../../shared/pipes/role-formatter.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginator,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    MatTabsModule,

    DownloadFileDirective,
    FileUploadModule,
    MaxCharDirective,
    OnlyNumbersDirective,
    ShowForRolesDirective,
    MaxWidthEllipsisDirective,

    RoleFormatterPipe,
    StatusFormatterPipe,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit, AfterViewInit {
  //TABLE
  @ViewChild(MatPaginator)
  public paginator: MatPaginator;
  public dataSource$: Observable<MatTableDataSource<IUserTable>> = of(
    new MatTableDataSource<IUserTable>([])
  );
  public totalCount: number = 0;
  public isLoading: boolean = false;
  public displayColumns = DISPLAYED_COLUMNS_USERS;
  public defaultPageSize = DEFAULT_PAGE_SIZE;

  //BUTTONS
  public actionButtons = TABLE_ACTIONS;
  public actionButtonAdd = ACTION_BUTTON_ADD;
  public actionButtonAddGroup = ACTION_BUTTON_ADD_GROUP;
  public activeActionbutton = ACTION_BUTTON_ADD;

  // PUPUP
  public classApplied: boolean = false;
  public titlePopup: string = '';

  // TAB
  public activeTabIndex: number = 0;

  // FORM
  public userForm: FormGroup;
  public userRoleOptions = USER_ROLES_OPTIONS;
  public baseStatesOptions = BASE_STATES_MAT_SELECT;
  public selectedUser: IUserTable | null = null;
  private userFilters: Partial<IUser> = {};
  private userPagination: IPagination = {
    page: 1,
    limit: DEFAULT_PAGE_SIZE[0],
  };

  //File
  public fileUploadControl: FileUploadControl;
  public templateFileUrl: string = TEMPLATE_FILE_ROUTES;
  public fileName: string = FILE_NAME_USERS;

  constructor(
    public themeService: CustomizerSettingsService,
    private _tokenService: TokenService,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private _fileUploadService: FileUploadService,
    private _excelService: ExcelService,
    private _dataComparisonService: DataComparisonService
  ) {}

  ngOnInit(): void {
    this.userFilters.roles = this.filterUserRolesOptions();
    this.dataSource$ = this.fetchUserData();
    this.userForm = this.setUserForm(this.activeActionbutton);
    this.fileUploadControl = this._fileUploadService.createFileUploadControl();
  }

  ngAfterViewInit(): void {
    this.dataSource$.pipe(
      tap((dataSource) => (dataSource.paginator = this.paginator))
    );
  }

  //Filters
  private filterUserRolesOptions(): USER_ROLES[] {
    const roles = this._tokenService.getUserRoles();

    const filteredOptions = USER_ROLES_OPTIONS.filter((option) =>
      option.showForRoles.some((role) => roles.includes(role))
    );

    return filteredOptions.map((option) => option.value);
  }

  //TABLE
  private fetchUserData(): Observable<MatTableDataSource<IUserTable>> {
    this.isLoading = true;
    return this._userService.list(this.userFilters, this.userPagination).pipe(
      map((res) => this.transformUserData(res)),
      finalize(() => (this.isLoading = false))
    );
  }

  private transformUserData(
    res: IApiResponse<IUser[]>
  ): MatTableDataSource<IUserTable> {
    const users = res.data?.result || [];
    const usersWithAction = users.map((user) => ({
      ...user,
      actions: COMMON_TABLE_ACTIONS,
    }));
    this.totalCount = res.data?.totalCount || 0;
    return new MatTableDataSource<IUserTable>(usersWithAction);
  }

  public onPageChange($event: PageEvent): void {
    const { pageIndex, pageSize } = $event;
    this.userPagination = { page: pageIndex + 1, limit: pageSize };
    this.dataSource$ = this.fetchUserData();
  }

  //BUTTONS
  public onActionButton(
    actionButton: ITableAction,
    element: IUserTable | null
  ): void {
    this.initializeFormForAction(actionButton, element);
    this.populateFormWithUserData(actionButton, element);
    this.togglePopup();
  }

  private initializeFormForAction(
    actionButton: ITableAction,
    element: IUserTable | null
  ): void {
    this.activeActionbutton = actionButton;
    this.titlePopup = actionButton.label;
    this.selectedUser = element;
    this.userForm = this.setUserForm(actionButton);
  }

  //POPUP
  private togglePopup(): void {
    this.classApplied = !this.classApplied;
  }

  public closePopup(): void {
    this.userForm.reset();
    this.fileUploadControl.clear();
    this.activeTabIndex = 0;
    this.selectedUser = null;
    this.resetUserRoleOptions();
    this.togglePopup();
  }

  private resetUserRoleOptions(): void {
    this.userRoleOptions.forEach((role) => (role.enabled = true));
  }

  //TAB
  public changeTab($event: MatTabChangeEvent): void {
    const { index } = $event;
    const actionButton = this.getActionButtonByIndex(index);
    this.initializeFormForAction(actionButton, null);
    this.fileUploadControl.clear();
  }

  private getActionButtonByIndex(index: number): ITableAction {
    const actionMap = new Map<number, ITableAction>([
      [0, this.actionButtonAdd],
      [1, this.actionButtonAddGroup],
    ]);
    return actionMap.get(index) || this.actionButtonAdd;
  }

  //FORM
  public setUserForm(buttonActive: ITableAction): FormGroup {
    const formConfig = this.getFormConfigByAction(buttonActive);
    return this._formBuilder.group(formConfig);
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

  public populateFormWithUserData(
    buttonActive: ITableAction,
    rowSelected: IUserTable | null
  ): void {
    if (
      buttonActive.name === TABLE_ACTIONS.ADD ||
      buttonActive.name === TABLE_ACTIONS.ADD_GROUP ||
      !rowSelected
    ) {
      return;
    }

    const { name, lastName, email, phoneNumber, roles, status } = rowSelected;
    this.userForm.patchValue({
      name,
      lastName,
      email,
      phoneNumber,
      roles,
      status,
    });

    this.toggleFormState(buttonActive);

    this.updateRoleOptionsBasedOnSelection(roles);
  }

  private toggleFormState(buttonActive: ITableAction): void {
    buttonActive.name === TABLE_ACTIONS.VIEW
      ? this.userForm.disable()
      : this.userForm.enable();

    if (buttonActive.name === TABLE_ACTIONS.EDIT) {
      this.userForm.get('email')?.disable();
    }
  }

  private updateRoleOptionsBasedOnSelection(roles: USER_ROLES[]): void {
    const { isStudentSelected, areAdminSupervisorTeacherSelected } =
      this.checkRoleSelection(roles);

    this.userRoleOptions.forEach((option) => {
      if (option.value === USER_ROLES.STUDENT) {
        option.enabled = !areAdminSupervisorTeacherSelected;
      } else {
        option.enabled = !isStudentSelected;
      }
    });
  }

  private checkRoleSelection(selectedValues: USER_ROLES[]): {
    isStudentSelected: boolean;
    areAdminSupervisorTeacherSelected: boolean;
  } {
    const isStudentSelected = selectedValues.includes(USER_ROLES.STUDENT);
    const areAdminSupervisorTeacherSelected = selectedValues.some((role) =>
      [USER_ROLES.ADMIN, USER_ROLES.SUPERVISOR, USER_ROLES.TEACHER].includes(
        role
      )
    );

    return { isStudentSelected, areAdminSupervisorTeacherSelected };
  }

  public updateRoleSelection(event: MatSelectChange): void {
    const selectedValues = event.value as USER_ROLES[];
    this.updateRoleOptionsBasedOnSelection(selectedValues);
    this.removeConflictingRoles(selectedValues);
  }

  private removeConflictingRoles(selectedValues: USER_ROLES[]): void {
    const { isStudentSelected, areAdminSupervisorTeacherSelected } =
      this.checkRoleSelection(selectedValues);

    if (isStudentSelected && areAdminSupervisorTeacherSelected) {
      this.userForm.patchValue({
        roles: selectedValues.filter((role) => role !== USER_ROLES.STUDENT),
      });
    }
  }

  public onSubmit(): void {
    if (this.userForm.invalid) return;

    const actionHandler = this.getActionHandlerByButton(
      this.activeActionbutton
    );

    actionHandler();
  }

  private getActionHandlerByButton(button: ITableAction): () => void {
    const actionMap = new Map<TABLE_ACTIONS, () => void>([
      [TABLE_ACTIONS.ADD, () => this.onAddUser()],
      [TABLE_ACTIONS.ADD_GROUP, () => this.onAddGroupUser()],
      [TABLE_ACTIONS.EDIT, () => this.onEditUser()],
      [TABLE_ACTIONS.DELETE, () => this.onDeleteUser()],
    ]);
    return actionMap.get(button.name) || (() => {});
  }

  private onAddUser(): void {
    const { name, lastName, email, password, phoneNumber, roles } =
      this.userForm.value;

    const newUser: Partial<IUser> = {
      name,
      lastName,
      email,
      password,
      phoneNumber,
      roles,
    };

    this._userService
      .register(newUser)
      .subscribe(() => this.afterProcessAction());
  }

  private onAddGroupUser(): void {
    if (
      this.fileUploadControl.invalid ||
      !this.fileUploadControl.value.length
    ) {
      return;
    }

    const { roles } = this.userForm.value;

    this._excelService
      .readExcel<Partial<IUser>>(
        this.fileUploadControl.value,
        EXPECTED_HEADERS_XLSX_USERS
      )
      .then((users) => {
        const usersWithRolesAndCorrectTypes = users.map((user) => {
          const convertedUser = convertToSchemaType<IUser>(user, USER_SCHEMA);
          return { ...convertedUser, roles };
        });

        this._userService
          .registerGroup(usersWithRolesAndCorrectTypes)
          .subscribe(() => this.afterProcessAction());
      });
  }

  private onEditUser(): void {
    if (!this.selectedUser) return;
    const { id, name, lastName, phoneNumber, roles, status } =
      this.selectedUser;
    const formValues: Partial<IUser> = this.userForm.value;
    const userSelectedValues: Partial<IUser> = {
      name,
      lastName,
      phoneNumber,
      roles,
      status,
    };

    const updatedFields = this._dataComparisonService.compareAndUpdate<IUser>(
      formValues,
      userSelectedValues,
      KEYS_TO_UPDATE_USER
    );

    if (Object.keys(updatedFields).length > 0) {
      this._userService
        .update(id, updatedFields)
        .subscribe(() => this.afterProcessAction());
    }
  }

  private onDeleteUser(): void {
    if (!this.selectedUser) return;
    this._userService
      .delete(this.selectedUser.id)
      .subscribe(() => this.afterProcessAction());
  }

  private afterProcessAction(): void {
    this.closePopup();
    this.dataSource$ = this.fetchUserData();
  }
}
