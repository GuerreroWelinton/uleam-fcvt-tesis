import { NgClass } from '@angular/common';
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
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  BASE_STATES_MAT_SELECT,
  BASE_STATES_OPTIONS,
  COMMON_TABLE_ACTIONS,
} from '../../core/constants/common.constant';
import { TABLE_ACTIONS } from '../../core/enums/table.enum';
import { ITableAction } from '../../core/interfaces/common.interface';
import { IMatSelectOption } from '../../core/interfaces/component.interface';
import { DataComparisonService } from '../../core/services/data-comparison.service';
import { CustomizerSettingsService } from '../../shared/components/customizer-settings/customizer-settings.service';
import { MaxCharDirective } from '../../shared/directives/max-char.directive';
import { MaxValueDirective } from '../../shared/directives/max-value.directive';
import { OnlyNumbersDirective } from '../../shared/directives/only-numbers.directive';
import { DISPLAYED_COLUMNS_PERIODS } from './helpers/period.constant';
import { IPeriod, IPeriodTable } from './interfaces/period.interface';
import { PeriodService } from './services/period.service';

@Component({
  selector: 'app-periods',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatPaginator,
    MatTableModule,
    MatTooltipModule,
    ReactiveFormsModule,
    NgClass,
    MaxCharDirective,
    MaxValueDirective,
    OnlyNumbersDirective,
  ],
  templateUrl: './periods.component.html',
  // styleUrl: './periods.component.scss'
})
export default class PeriodsComponent implements OnInit {
  //TABLE
  @ViewChild(MatPaginator)
  public paginator: MatPaginator;
  public dataSource = new MatTableDataSource<IPeriod>([]);
  public DISPLAYED_COLUMNS: string[] = DISPLAYED_COLUMNS_PERIODS;
  public BASE_STATES_OPTIONS: any = BASE_STATES_OPTIONS;

  // BUTTONS
  public buttonActive: TABLE_ACTIONS = TABLE_ACTIONS.ADD;
  public TABLE_ACTIONS = TABLE_ACTIONS;

  // POPUP
  public classApplied: boolean = false;
  public titlePopup: string = '';

  // FORM
  public periodForm: FormGroup;
  public BASE_STATES_MAT_SELECT: IMatSelectOption[] = BASE_STATES_MAT_SELECT;
  private periodSelected: IPeriodTable = {} as IPeriodTable;

  constructor(
    public themeService: CustomizerSettingsService,
    private _periodService: PeriodService,
    private _formBuilder: FormBuilder,
    private _dataComparisonService: DataComparisonService
  ) {
    this.periodForm = this.setPeriodForm();
  }

  ngOnInit(): void {
    this.fetchPeriods();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // TABLE
  public fetchPeriods(): void {
    this._periodService.list().subscribe((res) => {
      return this.setDataSource(res.data?.result);
    });
  }

  private setDataSource(periods?: IPeriod[]): void {
    if (periods) {
      const periodsWithAction = periods.map((period) => ({
        ...period,
        action: COMMON_TABLE_ACTIONS,
      }));
      this.dataSource.data = periodsWithAction;
    } else {
      this.dataSource.data = [];
    }
  }

  // BUTTONS
  public onActionAdd() {
    this.periodSelected = {} as IPeriodTable;
    this.titlePopup = 'Añadir';
    this.buttonActive = TABLE_ACTIONS.ADD;
    this.patchValueToForm(this.buttonActive);
    this.togglePopup();
  }

  public onAction(item: ITableAction, element: IPeriodTable): void {
    this.periodSelected = element;
    this.titlePopup = item.label;
    this.buttonActive = item.name;
    this.patchValueToForm(this.buttonActive);
    this.togglePopup();
  }

  private patchValueToForm(action: TABLE_ACTIONS): void {
    const { code, status } = this.periodSelected;
    this.periodForm.patchValue({
      code: action !== TABLE_ACTIONS.ADD ? code : '',
      status: action !== TABLE_ACTIONS.ADD ? status : '',
    });
    if (action === TABLE_ACTIONS.VIEW) {
      this.periodForm.disable();
    } else {
      this.periodForm.enable();
    }
  }

  // POPUP
  public togglePopup(): void {
    this.classApplied = !this.classApplied;
  }

  public onClosePopup(): void {
    this.periodForm.reset();
    this.togglePopup();
  }

  //FORM
  private setPeriodForm(): FormGroup<any> {
    return this._formBuilder.group({
      code: ['', [Validators.required]],
      status: [''],
    });
  }

  public onSubmit(): void {
    if (this.periodForm.invalid) return;
    if (this.buttonActive === TABLE_ACTIONS.ADD) {
      this.onAddPeriod();
    } else if (this.buttonActive === TABLE_ACTIONS.EDIT) {
      this.onEditPeriod();
    } else if (this.buttonActive === TABLE_ACTIONS.DELETE) {
      this.onDeletePeriod();
    }
  }

  private onAddPeriod(): void {
    const { code, status } = this.periodForm.value;
    this._periodService
      .register({ code, status })
      .subscribe(() => this.afterProcessAction());
  }

  public onEditPeriod(): void {
    const { id, code, status } = this.periodSelected;
    const formValues: Partial<IPeriod> = this.periodForm.value;
    const periodSelectedValues: Partial<IPeriod> = {
      code,
      status,
    };
    const keys: (keyof IPeriod)[] = ['code', 'status'];
    const updatedFields = this._dataComparisonService.compareAndUpdate<IPeriod>(
      formValues,
      periodSelectedValues,
      keys
    );
    if (Object.keys(updatedFields).length > 0) {
      this._periodService
        .update(id, updatedFields)
        .subscribe(() => this.afterProcessAction());
    }
  }

  private onDeletePeriod(): void {
    const { id } = this.periodSelected;
    this._periodService.delete(id).subscribe(() => this.afterProcessAction());
  }

  private afterProcessAction(): void {
    this.fetchPeriods();
    this.onClosePopup();
  }
}
