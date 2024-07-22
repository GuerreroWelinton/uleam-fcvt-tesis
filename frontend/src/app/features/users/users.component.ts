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
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileUploadControl, FileUploadModule } from '@iplab/ngx-file-upload';
import { map } from 'rxjs';
import {
  ACTION_BUTTON_ADD,
  BASE_STATES_MAT_SELECT,
  BASE_STATES_OPTIONS,
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
import { RoleFormatterPipe } from '../../shared/pipes/role-formatter.pipe';
import { MaxWidthEllipsisDirective } from '../../shared/directives/max-width-ellipsis.directive';

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
})
export class UsersComponent implements OnInit, AfterViewInit {
  //TABLE
  @ViewChild(MatPaginator)
  public paginator: MatPaginator;
  public dataSource = new MatTableDataSource<IUserTable>([]);
  public totalDataCount: number = 0;
  public isLoading: boolean = false;
  public DISPLAYED_COLUMNS = DISPLAYED_COLUMNS_USERS;
  public BASE_STATES_OPTIONS = BASE_STATES_OPTIONS;
  public DEFAULT_PAGE_SIZE = DEFAULT_PAGE_SIZE;

  //BUTTONS
  public TABLE_ACTIONS = TABLE_ACTIONS;
  public ACTION_BUTTON_ADD = ACTION_BUTTON_ADD;
  public buttonActive = ACTION_BUTTON_ADD;

  // PUPUP
  public classApplied: boolean = false;
  public titlePopup: string = '';

  // FORM
  public userForm: FormGroup;
  public fileUploadControl: FileUploadControl;
  public USER_ROLES_OPTIONS = USER_ROLES_OPTIONS;
  public BASE_STATES_MAT_SELECT = BASE_STATES_MAT_SELECT;
  public FILE_NAME: string = FILE_NAME_USERS;
  public TEMPLATE_FILE_ROUTES: string = TEMPLATE_FILE_ROUTES;
  private filters: Partial<IUser> = {};
  public pagination: IPagination = { page: 1, limit: DEFAULT_PAGE_SIZE[0] };
  public userSelected: IUser | null = null;

  constructor(
    public themeService: CustomizerSettingsService,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private _fileUploadService: FileUploadService,
    private _excelService: ExcelService,
    private _dataComparisonService: DataComparisonService
  ) {}

  ngOnInit(): void {
    this.setDataSource();
    this.userForm = this.setUserForm(this.buttonActive);
    this.fileUploadControl = this._fileUploadService.createFileUploadControl();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  //TABLE
  private setDataSource(): void {
    this.isLoading = true;
    this._userService
      .list(this.filters, this.pagination)
      .pipe(
        map((res) => {
          const users = res.data?.result || [];
          // console.log('🚀 ~ UsersComponent ~ map ~ users:', users);
          const usersWithAction = users.map((user) => ({
            ...user,
            actions: COMMON_TABLE_ACTIONS,
          }));
          this.totalDataCount = res.data?.totalCount || 0;
          return new MatTableDataSource<IUserTable>(usersWithAction);
        })
      )
      .subscribe((dataSource) => {
        this.dataSource = dataSource;
        this.isLoading = false;
      });
  }

  public onPageChange($event: PageEvent): void {
    const { pageIndex, pageSize } = $event;
    this.pagination = { page: pageIndex + 1, limit: pageSize };
    this.setDataSource();
  }

  //BUTTONS
  public onActionButton(
    actionButton: ITableAction,
    element: IUserTable | null
  ): void {
    this.buttonActive = actionButton;
    this.titlePopup = actionButton.label;
    this.userSelected = element;
    this.userForm = this.setUserForm(actionButton);
    this.patchValueToForm(actionButton, element);
    this.togglePopup();
  }

  //POPUP
  private togglePopup(): void {
    this.classApplied = !this.classApplied;
  }

  public onClosedPopup(): void {
    this.togglePopup();
    this.userForm.reset();
    this.fileUploadControl.clear();
    this.userSelected = null;
  }

  //FORM
  public setUserForm(buttonActive: ITableAction): FormGroup<any> {
    if (buttonActive.name === TABLE_ACTIONS.ADD) {
      return this._formBuilder.group({
        roles: [null, [Validators.required]],
      });
    }

    if (buttonActive.name === TABLE_ACTIONS.DELETE) {
      return this._formBuilder.group({});
    }

    // default for view and edit
    return this._formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(10)]],
      roles: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  public patchValueToForm(
    buttonActive: ITableAction,
    rowSelected: IUserTable | null
  ): void {
    if (buttonActive.name === TABLE_ACTIONS.ADD || !rowSelected) return;

    const { name, lastName, email, phoneNumber, roles, status } = rowSelected;
    this.userForm.patchValue({
      name,
      lastName,
      email,
      phoneNumber,
      roles,
      status,
    });
    buttonActive.name === TABLE_ACTIONS.VIEW
      ? this.userForm.disable()
      : this.userForm.enable();

    if (buttonActive.name === TABLE_ACTIONS.EDIT) {
      this.userForm.get('email')?.disable();
    }
  }

  public onSubmit(): void {
    if (this.userForm.invalid) return;

    if (this.buttonActive.name === TABLE_ACTIONS.ADD) this.onAddUser();
    if (this.buttonActive.name === TABLE_ACTIONS.EDIT) this.onEditUser();
    if (this.buttonActive.name === TABLE_ACTIONS.DELETE) this.onDeleteUser();

    this.onClosedPopup();
  }

  private onAddUser(): void {
    if (
      this.fileUploadControl.invalid ||
      !this.fileUploadControl.value.length
    ) {
      return;
    }
    const { roles } = this.userForm.value;
    this.fileUploadControl.value;
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
          .subscribe(() => this.setDataSource());
      });
  }

  private onEditUser(): void {
    if (!this.userSelected) return;
    const { id, name, lastName, email, phoneNumber, roles, status } =
      this.userSelected;
    const formValues: Partial<IUser> = this.userForm.value;
    const userSelectedValues: Partial<IUser> = {
      name,
      lastName,
      // email,
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
        .subscribe(() => this.setDataSource());
    }
  }

  private onDeleteUser(): void {
    if (!this.userSelected) return;
    this._userService
      .delete(this.userSelected.id)
      .subscribe(() => this.setDataSource());
  }
}
