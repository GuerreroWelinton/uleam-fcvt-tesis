import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { finalize, map, Observable, of, tap } from 'rxjs';
import {
  ACTION_BUTTON_ADD,
  BASE_STATES_MAT_SELECT,
  COMMON_TABLE_ACTIONS,
  DEFAULT_PAGE_SIZE,
} from '../../core/constants/component.constant';
import { TABLE_ACTIONS } from '../../core/enums/component.enum';
import { BASE_RECORD_STATES } from '../../core/enums/general.enum';
import { IApiResponse } from '../../core/interfaces/api-response.interface';
import { ITableAction } from '../../core/interfaces/component.interface';
import { IFilters } from '../../core/interfaces/general.interface';
import { IPeriod, IPeriodTable } from '../../core/interfaces/period.interface';
import { DataComparisonService } from '../../core/services/data-comparison.service';
import { PeriodService } from '../../core/services/period.service';
import { CustomizerSettingsService } from '../../shared/components/customizer-settings/customizer-settings.service';
import { MaxCharDirective } from '../../shared/directives/max-char.directive';
import { BaseStatusFormatterPipe } from '../../shared/pipes/base-status-formatter.pipe';
import { DISPLAYED_COLUMNS_PERIODS } from './helpers/period.constant';

@Component({
  selector: 'app-periods',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgClass,
    ReactiveFormsModule,

    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginator,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,

    BaseStatusFormatterPipe,

    MaxCharDirective,
  ],
  templateUrl: './periods.component.html',
  // styleUrl: './periods.component.scss'
})
export default class PeriodsComponent implements OnInit {
  //TABLE
  public isLoading: boolean = false;
  public dataSource$: Observable<MatTableDataSource<IPeriodTable>> = of(
    new MatTableDataSource<IPeriodTable>([])
  );
  public displayedColumns: string[] = DISPLAYED_COLUMNS_PERIODS;
  private filters: IFilters = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE[0],
    status: [BASE_RECORD_STATES.ACTIVE, BASE_RECORD_STATES.INACTIVE],
  };

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
  public periodForm: FormGroup;
  public baseStatesOptions = BASE_STATES_MAT_SELECT;
  private periodSelected: IPeriodTable | null = null;

  constructor(
    public themeService: CustomizerSettingsService,
    private _periodService: PeriodService,
    private _formBuilder: FormBuilder,
    private _dataComparisonService: DataComparisonService
  ) {}

  ngOnInit(): void {
    this.dataSource$ = this.fetchPeriodData();
    this.periodForm = this.setForm(ACTION_BUTTON_ADD);
  }

  ngAfterViewInit(): void {
    this.dataSource$.pipe(
      tap((dataSource) => (dataSource.paginator = this.paginator))
    );
  }

  // TABLE
  public fetchPeriodData(): Observable<MatTableDataSource<IPeriodTable>> {
    this.isLoading = true;
    return this._periodService.list(this.filters).pipe(
      map((res) => this.transformPeriodData(res)),
      finalize(() => (this.isLoading = false))
    );
  }

  private transformPeriodData(
    res: IApiResponse<IPeriod[]>
  ): MatTableDataSource<IPeriodTable> {
    const periods = res.data?.result || [];
    const periodsTable = periods.map((period) => ({
      ...period,
      actions: COMMON_TABLE_ACTIONS,
    }));
    this.totalCount = res.data?.totalCount || 0;
    return new MatTableDataSource<IPeriodTable>(periodsTable);
  }

  // BUTTONS
  public onActionButton(
    actionButton: ITableAction,
    rowSelected: IPeriodTable | null
  ): void {
    this.initializeForm(actionButton, rowSelected);
    this.populateForm(actionButton, rowSelected);
    this.togglePopup();
  }

  // POPUP
  private togglePopup(): void {
    this.classApplied = !this.classApplied;
  }

  public closePopup(): void {
    this.periodForm.reset();
    this.periodSelected = null;
    this.togglePopup();
  }

  // FORM
  private initializeForm(
    actionButton: ITableAction,
    rowSelected: IPeriodTable | null
  ): void {
    this.activeActionButton = actionButton;
    this.titlePopup = actionButton.label;
    this.periodForm = this.setForm(actionButton);
    this.periodSelected = rowSelected;
  }

  private setForm(actionButton: ITableAction): FormGroup {
    const formConfig = this.getFormConfig(actionButton);
    return this._formBuilder.group(formConfig);
  }

  private getFormConfig(actionButton: ITableAction): object {
    const defaultFormConfig = {
      code: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
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
    rowSelected: IPeriodTable | null
  ): void {
    this.toogleFormState(actionButton);

    if (
      actionButton.name === TABLE_ACTIONS.ADD ||
      actionButton.name === TABLE_ACTIONS.DELETE ||
      !rowSelected
    ) {
      return;
    }

    const { code, startDate, endDate, status } = rowSelected;

    this.periodForm.patchValue({ code, startDate, endDate, status });
  }

  private toogleFormState(actionButton: ITableAction): void {
    actionButton.name === TABLE_ACTIONS.VIEW
      ? this.periodForm.disable()
      : this.periodForm.enable();
  }

  public onPageChange($event: PageEvent): void {
    const { pageIndex, pageSize } = $event;
    this.filters = { ...this.filters, page: pageIndex + 1, limit: pageSize };
    this.dataSource$ = this.fetchPeriodData();
  }

  public onSubmit(): void {
    if (this.periodForm.invalid) return;
  }

  // public onSubmit(): void {
  //   if (this.periodForm.invalid) return;
  //   if (this.buttonActive === TABLE_ACTIONS.ADD) {
  //     this.onAddPeriod();
  //   } else if (this.buttonActive === TABLE_ACTIONS.EDIT) {
  //     this.onEditPeriod();
  //   } else if (this.buttonActive === TABLE_ACTIONS.DELETE) {
  //     this.onDeletePeriod();
  //   }
  // }

  // private onAddPeriod(): void {
  //   const { code, status } = this.periodForm.value;
  //   this._periodService
  //     .register({ code, status })
  //     .subscribe(() => this.afterProcessAction());
  // }

  // public onEditPeriod(): void {
  //   const { id, code, status } = this.periodSelected;
  //   const formValues: Partial<IPeriod> = this.periodForm.value;
  //   const periodSelectedValues: Partial<IPeriod> = {
  //     code,
  //     status,
  //   };
  //   const keys: (keyof IPeriod)[] = ['code', 'status'];
  //   const updatedFields = this._dataComparisonService.compareAndUpdate<IPeriod>(
  //     formValues,
  //     periodSelectedValues,
  //     keys
  //   );
  //   if (Object.keys(updatedFields).length > 0) {
  //     this._periodService
  //       .update(id, updatedFields)
  //       .subscribe(() => this.afterProcessAction());
  //   }
  // }

  // private onDeletePeriod(): void {
  //   const { id } = this.periodSelected;
  //   this._periodService.delete(id).subscribe(() => this.afterProcessAction());
  // }

  private afterProcessAction(): void {
    this.dataSource$ = this.fetchPeriodData();
    this.closePopup();
  }
}
