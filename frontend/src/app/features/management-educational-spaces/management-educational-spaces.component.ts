import { AsyncPipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
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
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import {
  ACTION_BUTTON_ADD,
  BASE_STATES_MAT_SELECT,
  COMMON_TABLE_ACTIONS,
  DEFAULT_PAGE_SIZE,
} from '../../core/constants/component.constant';
import { TABLE_ACTIONS } from '../../core/enums/component.enum';
import { BASE_RECORD_STATES, USER_ROLES } from '../../core/enums/general.enum';
import { IApiResponse } from '../../core/interfaces/api-response.interface';
import {
  IMatSelectOption,
  ITableAction,
} from '../../core/interfaces/component.interface';
import { ManagementEducationalSpacesService } from '../../core/services/management-educational-spaces.service';
import { CustomizerSettingsService } from '../../shared/components/customizer-settings/customizer-settings.service';
import { MaxCharDirective } from '../../shared/directives/max-char.directive';
import { OnlyNumbersDirective } from '../../shared/directives/only-numbers.directive';
import { StatusFormatterPipe } from '../../shared/pipes/status-formatter.pipe';
import { BuildingService } from '../buildings/services/building.service';
import { DISPLAYED_COLUMNS_EDUCATIONAL_SPACES } from './helpers/educational-spaces.constant';
import {
  IEducationalSpace,
  IEducationalSpaceTable,
} from './interfaces/educational-spaces.interface';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { DataComparisonService } from '../../core/services/data-comparison.service';
import { UsersService } from '../users/services/users.service';

@Component({
  selector: 'app-management-educational-spaces',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    ReactiveFormsModule,

    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginator,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,

    StatusFormatterPipe,

    MaxCharDirective,
    OnlyNumbersDirective,
  ],
  templateUrl: './management-educational-spaces.component.html',
})
export default class ManagementEducationalSpacesComponent
  implements OnInit, AfterViewInit
{
  // TABLE
  public isLoading: boolean = false;
  public dataSource$: Observable<MatTableDataSource<IEducationalSpaceTable>> =
    of(new MatTableDataSource<IEducationalSpaceTable>([]));
  public displayedColumns = DISPLAYED_COLUMNS_EDUCATIONAL_SPACES;

  // PAGINATOR
  @ViewChild(MatPaginator)
  public paginator: MatPaginator;
  public totalCount: number = 0;
  public defaultPageSize = DEFAULT_PAGE_SIZE;

  // BUTTONS
  public actionButtons = TABLE_ACTIONS;
  public actionButtonAdd = ACTION_BUTTON_ADD;
  public activeActionButton = ACTION_BUTTON_ADD;

  // POPUP
  public classApplied: boolean = false;
  public titlePopup: string = '';

  // FORM
  public eduSpaceForm: FormGroup;
  public baseStatesOptions = BASE_STATES_MAT_SELECT;
  public floorsOptions: number[] = [];
  public buildings$: Observable<IMatSelectOption<string>[]> = of([]);
  private buildings: Array<{ id: string; floors: number }> = [];
  private eduSpaceSelected: IEducationalSpaceTable | null = null;

  @ViewChild('usersInput')
  public usersInput: ElementRef<HTMLInputElement>;
  public users$: Observable<IMatSelectOption<string>[]> = of([]);
  public usersSelected: IMatSelectOption<string>[] = [];
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public disabledMatChip: boolean = false;

  constructor(
    public themeService: CustomizerSettingsService,
    private _managementEducationalSpacesService: ManagementEducationalSpacesService,
    private _buildingService: BuildingService,
    private _userService: UsersService,
    private _formBuilder: FormBuilder,
    private _dataComparisonService: DataComparisonService
  ) {}

  ngOnInit(): void {
    this.dataSource$ = this.fetchEduSpaceData();
    this.buildings$ = this.fetchBuildingsData();
    this.users$ = this.fetchUsersData();
    this.eduSpaceForm = this.setForm(this.activeActionButton);
  }

  ngAfterViewInit(): void {
    this.dataSource$.pipe(
      tap((dataSource) => (dataSource.paginator = this.paginator))
    );
  }

  // TABLE
  private fetchEduSpaceData(): Observable<
    MatTableDataSource<IEducationalSpaceTable>
  > {
    this.isLoading = true;
    return this._managementEducationalSpacesService.list().pipe(
      map((res) => this.transformEduSpaceData(res)),
      finalize(() => (this.isLoading = false))
    );
  }

  private transformEduSpaceData(
    res: IApiResponse<IEducationalSpace[]>
  ): MatTableDataSource<IEducationalSpaceTable> {
    this.isLoading = false;
    const educationalSpaces = res.data?.result || [];
    const educationalSpacesTable = educationalSpaces.map((space) => ({
      ...space,
      actions: COMMON_TABLE_ACTIONS,
    }));
    this.totalCount = res.data?.totalCount || 0;
    return new MatTableDataSource<IEducationalSpaceTable>(
      educationalSpacesTable
    );
  }

  // BUTTONS
  public onActionButton(
    actionButton: ITableAction,
    rowSelected: IEducationalSpaceTable | null
  ): void {
    this.initializeForm(actionButton, rowSelected);
    this.populateForm(actionButton, rowSelected);
    this.togglePopup();
  }

  private initializeForm(
    actionButton: ITableAction,
    rowSelected: IEducationalSpaceTable | null
  ): void {
    this.activeActionButton = actionButton;
    this.titlePopup = actionButton.label;
    this.eduSpaceSelected = rowSelected;
    this.eduSpaceForm = this.setForm(actionButton);
  }

  // POPUP
  private togglePopup(): void {
    this.classApplied = !this.classApplied;
  }

  public closePopup(): void {
    this.eduSpaceForm.reset();
    this.eduSpaceSelected = null;
    this.floorsOptions = [];
    this.usersSelected = [];
    this.togglePopup();
  }

  // FORM
  private fetchBuildingsData(): Observable<IMatSelectOption<string>[]> {
    return this._buildingService.list().pipe(
      map((res) => res.data?.result || []),
      map((buildings) =>
        buildings
          .filter((building) => building.status === BASE_RECORD_STATES.ACTIVE)
          .map((building) => {
            this.buildings.push({
              id: building.id,
              floors: building.numberOfFloors,
            });
            return { value: building.id, viewValue: building.name };
          })
      ),
      catchError(() => of([]))
    );
  }

  private fetchUsersData(): Observable<IMatSelectOption<string>[]> {
    return this._userService
      .list(
        { roles: [USER_ROLES.ADMIN, USER_ROLES.SUPERVISOR] },
        { page: 1, limit: 10 }
      )
      .pipe(
        map((res) => res.data?.result || []),
        map((users) =>
          users.map((user) => ({
            value: user.id,
            viewValue: `${user.name} ${user.lastName}`,
          }))
        )
      );
  }

  private setForm(actionButton: ITableAction): FormGroup {
    const formConfig = this.getFormConfig(actionButton);
    return this._formBuilder.group(formConfig);
  }

  private getFormConfig(actionButton: ITableAction): object {
    const defaultFormConfig = {
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      floor: ['', [Validators.required]],
      capacity: ['', [Validators.required]],
      buildingId: ['', [Validators.required]],
      usersId: ['', [Validators.required]],
    };

    const viewAndEditFormConfig = {
      ...defaultFormConfig,
      status: ['', [Validators.required]],
    };

    const configMap = new Map<TABLE_ACTIONS, object>([
      [TABLE_ACTIONS.ADD, defaultFormConfig],
      [TABLE_ACTIONS.EDIT, viewAndEditFormConfig],
      [TABLE_ACTIONS.VIEW, viewAndEditFormConfig],
      [TABLE_ACTIONS.DELETE, {}],
    ]);

    return configMap.get(actionButton.name) || {};
  }

  private populateForm(
    actionButton: ITableAction,
    rowSelected: IEducationalSpaceTable | null
  ): void {
    this.toogleFormState(actionButton);

    if (
      actionButton.name === TABLE_ACTIONS.ADD ||
      actionButton.name === TABLE_ACTIONS.DELETE ||
      !rowSelected
    ) {
      return;
    }

    const { name, code, capacity, building, users, floor, status } =
      rowSelected;
    this.eduSpaceForm.patchValue({
      name,
      code,
      capacity,
      buildingId: building.id,
      usersId: users.map((user) => user.id),
      floor,
      status,
    });

    users.forEach((user) => {
      if (
        !this.usersSelected.some(
          (userSelected) => userSelected.value === user.id
        )
      ) {
        this.usersSelected.push({
          value: user.id,
          viewValue: `${user.name} ${user.lastName}`,
        });
        this.updateUsersId();
      }
    });

    this.floorsOptions = this.generateNumbersArray(building.numberOfFloors);
  }

  private toogleFormState(actionButton: ITableAction): void {
    actionButton.name === TABLE_ACTIONS.VIEW
      ? (this.eduSpaceForm.disable(), (this.disabledMatChip = true))
      : (this.eduSpaceForm.enable(), (this.disabledMatChip = false));
  }

  private generateNumbersArray(length: number): number[] {
    return Array.from({ length }, (_, i) => i + 1);
  }

  public onBuildingChange($event: MatSelectChange): void {
    const { value } = $event;
    this.eduSpaceForm.patchValue({ floor: '' });
    this.buildings.forEach((building) => {
      if (building.id === value) {
        this.floorsOptions = this.generateNumbersArray(building.floors);
      }
    });
  }

  public onSubmit(): void {
    if (this.eduSpaceForm.invalid) return;
    const actionHandler = this.getActionHandler(this.activeActionButton);
    actionHandler();
  }

  private getActionHandler(actionButton: ITableAction): () => void {
    const actionHandlerMap = new Map<TABLE_ACTIONS, () => void>([
      [TABLE_ACTIONS.ADD, () => this.addEducationalSpace()],
      [TABLE_ACTIONS.EDIT, () => this.editEducationalSpace()],
      [TABLE_ACTIONS.DELETE, () => this.deleteEducationalSpace()],
    ]);

    return actionHandlerMap.get(actionButton.name) || (() => {});
  }

  private addEducationalSpace(): void {
    const { name, code, floor, capacity, buildingId, usersId } =
      this.eduSpaceForm.value;

    const educationalSpace = {
      name,
      code,
      floor,
      capacity,
      buildingId,
      usersId,
    };

    this._managementEducationalSpacesService
      .register(educationalSpace)
      .subscribe(() => this.afterProcessAction());
  }

  private editEducationalSpace(): void {
    if (!this.eduSpaceSelected) return;

    const formValues = this.eduSpaceForm.value;
    const { id, name, code, floor, capacity, building, users, status } =
      this.eduSpaceSelected;
    const eduSpaceSelected = {
      name,
      code,
      capacity,
      buildingId: building.id,
      floor,
      usersId: users.map((user) => user.id),
      status,
    };
    const keysToUpdate = [
      'name',
      'code',
      'capacity',
      'buildingId',
      'floor',
      'usersId',
      'status',
    ];

    const updatedEducationalSpace =
      this._dataComparisonService.compareAndUpdate<any>(
        formValues,
        eduSpaceSelected,
        keysToUpdate
      );

    if (Object.keys(updatedEducationalSpace).length > 0) {
      this._managementEducationalSpacesService
        .update(id, updatedEducationalSpace)
        .subscribe(() => this.afterProcessAction());
    }
  }

  private deleteEducationalSpace(): void {
    if (!this.eduSpaceSelected) return;
    const { id } = this.eduSpaceSelected;
    this._managementEducationalSpacesService
      .delete(id)
      .subscribe(() => this.afterProcessAction());
  }

  private afterProcessAction(): void {
    this.closePopup();
    this.dataSource$ = this.fetchEduSpaceData();
  }

  public onSelectedUser(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    const viewValue = event.option.viewValue;
    if (!this.usersSelected.some((user) => user.value === value)) {
      this.usersSelected.push({ value, viewValue });
      this.updateUsersId();
    }
    this.usersInput.nativeElement.value = '';
  }

  public onRemoveUser(userId: string): void {
    const userIndex = this.usersSelected.findIndex(
      (user) => user.value === userId
    );
    if (userIndex !== -1) {
      this.usersSelected.splice(userIndex, 1);
      this.updateUsersId();
    }
  }

  private updateUsersId(): void {
    const selectedIds = this.usersSelected.map((user) => user.value);
    this.eduSpaceForm.get('usersId')?.setValue(selectedIds);
  }
}
