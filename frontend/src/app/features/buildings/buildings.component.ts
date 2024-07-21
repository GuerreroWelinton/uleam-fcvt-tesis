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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { first } from 'rxjs';
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
import { DISPLAYED_COLUMNS_BUILDINGS } from './helpers/building.constant';
import { IBuilding, IBuildingTable } from './interfaces/building.interface';
import { BuildingService } from './services/building.service';
import { MatSelectModule } from '@angular/material/select';
import { OnlyNumbersDirective } from '../../shared/directives/only-numbers.directive';

@Component({
  selector: 'app-buildings',
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
  templateUrl: './buildings.component.html',
})
export default class BuildingsComponent implements OnInit, AfterViewInit {
  // TABLE
  @ViewChild(MatPaginator)
  public paginator: MatPaginator;
  public dataSource = new MatTableDataSource<IBuildingTable>([]);
  public DISPLAYED_COLUMNS: string[] = DISPLAYED_COLUMNS_BUILDINGS;
  public BASE_STATES_OPTIONS: any = BASE_STATES_OPTIONS;

  // BUTTONS
  public buttonActive: TABLE_ACTIONS = TABLE_ACTIONS.ADD;
  public TABLE_ACTIONS = TABLE_ACTIONS;

  // POPUP
  public classApplied: boolean = false;
  public titlePopup: string = '';

  // FORM
  public buildingForm: FormGroup;
  public BASE_STATES_MAT_SELECT: IMatSelectOption[] = BASE_STATES_MAT_SELECT;
  private buildingSelected: IBuildingTable = {} as IBuildingTable;

  constructor(
    public themeService: CustomizerSettingsService,
    private _buildingsService: BuildingService,
    private _formBuilder: FormBuilder,
    private _dataComparisonService: DataComparisonService
  ) {
    this.buildingForm = this.setBuildingForm();
  }

  ngOnInit(): void {
    this.fetchBuildings();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // TABLE
  private fetchBuildings(): void {
    this._buildingsService
      .list()
      .pipe(first())
      .subscribe((res) => this.setDataSource(res.data?.result));
  }

  private setDataSource(buildings?: IBuilding[]): void {
    if (buildings) {
      const buildingsWithAction = buildings.map((building) => ({
        ...building,
        action: COMMON_TABLE_ACTIONS,
      }));
      this.dataSource.data = buildingsWithAction;
    } else {
      this.dataSource.data = [];
    }
  }

  // BUTTONS
  public onActionAdd() {
    this.buildingSelected = {} as IBuildingTable;
    this.titlePopup = 'Añadir';
    this.buttonActive = TABLE_ACTIONS.ADD;
    this.patchValueToForm(this.buttonActive);
    this.togglePopup();
  }

  public onAction(item: ITableAction, element: IBuildingTable): void {
    this.buildingSelected = element;
    this.titlePopup = item.label;
    this.buttonActive = item.name;
    this.patchValueToForm(this.buttonActive);
    this.togglePopup();
  }

  private patchValueToForm(action: TABLE_ACTIONS): void {
    const { name, code, address, numberOfFloors, status } =
      this.buildingSelected;
    this.buildingForm.patchValue({
      name: action !== TABLE_ACTIONS.ADD ? name : '',
      code: action !== TABLE_ACTIONS.ADD ? code : '',
      address: action !== TABLE_ACTIONS.ADD ? address : '',
      numberOfFloors: action !== TABLE_ACTIONS.ADD ? numberOfFloors : '',
      status: action !== TABLE_ACTIONS.ADD ? status : '',
    });
    if (action === TABLE_ACTIONS.VIEW) {
      this.buildingForm.disable();
    } else {
      this.buildingForm.enable();
    }
  }

  // POPUP
  public togglePopup(): void {
    this.classApplied = !this.classApplied;
  }

  public onClosePopup(): void {
    this.buildingForm.reset();
    this.togglePopup();
  }

  // FORM
  private setBuildingForm(): FormGroup<any> {
    return this._formBuilder.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      address: ['', [Validators.required]],
      numberOfFloors: ['', [Validators.required]],
      status: [''],
    });
  }

  public onSubmit(): void {
    if (this.buildingForm.invalid) return;
    if (this.buttonActive === TABLE_ACTIONS.ADD) {
      this.onAddBuilding();
    } else if (this.buttonActive === TABLE_ACTIONS.EDIT) {
      this.onEditBuilding();
    } else if (this.buttonActive === TABLE_ACTIONS.DELETE) {
      this.onDeleteBuilding();
    }
  }

  private onAddBuilding(): void {
    const { name, code, address, numberOfFloors } = this.buildingForm.value;
    this._buildingsService
      .register({ name, code, address, numberOfFloors })
      .subscribe(() => this.afterProcessAction());
  }

  private onEditBuilding(): void {
    const { id } = this.buildingSelected;
    const { name, code, address, numberOfFloors, status } =
      this.buildingSelected;
    const formValues: Partial<IBuilding> = this.buildingForm.value;
    const buildingSelectedValues: Partial<IBuilding> = {
      name,
      code,
      address,
      numberOfFloors,
      status,
    };
    const keys: (keyof IBuilding)[] = [
      'name',
      'code',
      'address',
      'numberOfFloors',
      'status',
    ];
    const updatedFields =
      this._dataComparisonService.compareAndUpdate<IBuilding>(
        formValues,
        buildingSelectedValues,
        keys
      );
    if (Object.keys(updatedFields).length > 0) {
      this._buildingsService
        .update(id, updatedFields)
        .subscribe(() => this.afterProcessAction());
    }
  }

  private onDeleteBuilding(): void {
    const { id } = this.buildingSelected;
    this._buildingsService
      .delete(id)
      .subscribe(() => this.afterProcessAction());
  }

  private afterProcessAction(): void {
    this.fetchBuildings();
    this.onClosePopup();
  }
}
