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
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { first } from 'rxjs';
import {
  BASE_STATES_MAT_SELECT,
  BASE_STATES_OPTIONS,
  COMMON_TABLE_ACTIONS,
} from '../../core/constants/component.constant';
import { TABLE_ACTIONS } from '../../core/enums/component.enum';
import {
  IMatSelectOption,
  ITableAction,
} from '../../core/interfaces/component.interface';
import { DataComparisonService } from '../../core/services/data-comparison.service';
import { CustomizerSettingsService } from '../../shared/components/customizer-settings/customizer-settings.service';
import { DownloadFileDirective } from '../../shared/directives/download-file.directive';
import { MaxCharDirective } from '../../shared/directives/max-char.directive';
import { MaxValueDirective } from '../../shared/directives/max-value.directive';
import { OnlyNumbersDirective } from '../../shared/directives/only-numbers.directive';
import { DISPLAYED_COLUMNS_CAREERS } from './helpers/careers.constant';
import { ICareer, ICareerTable } from './interfaces/careers.interface';
import { CareersService } from './services/careers.service';

@Component({
  selector: 'app-careers',
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
    FileUploadModule,
    NgClass,
    DownloadFileDirective,
    MaxCharDirective,
    MaxValueDirective,
    OnlyNumbersDirective,
  ],
  templateUrl: './careers.component.html',
  // styleUrl: './careers.component.scss',
})
export default class CareersComponent implements OnInit, AfterViewInit {
  // TABLE
  @ViewChild(MatPaginator)
  public paginator: MatPaginator;
  public dataSource = new MatTableDataSource<ICareerTable>([]);
  public DISPLAYED_COLUMNS: string[] = DISPLAYED_COLUMNS_CAREERS;
  public BASE_STATES_OPTIONS: any = BASE_STATES_OPTIONS;

  // BUTTONS
  public buttonActive: TABLE_ACTIONS = TABLE_ACTIONS.ADD;
  public TABLE_ACTIONS = TABLE_ACTIONS;

  // PUPUP
  public classApplied: boolean = false;
  public titlePopup: string = '';

  // FORM
  public careerForm: FormGroup;
  public BASE_STATES_MAT_SELECT = BASE_STATES_MAT_SELECT;
  private careerSelected: ICareerTable = {} as ICareerTable;
  // public FILE_NAME: string = FILE_NAME_SUBJECTS;
  // public TEMPLATE_FILE_ROUTES: string = TEMPLATE_FILE_ROUTES;

  constructor(
    public themeService: CustomizerSettingsService,
    private _careersService: CareersService,
    private _formBuilder: FormBuilder,
    private _dataComparisonService: DataComparisonService // private _excelService: ExcelService
  ) {
    this.careerForm = this.setCareerForm();
  }

  ngOnInit(): void {
    this.fetchCareers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // TABLE
  private fetchCareers(): void {
    this._careersService
      .list()
      .pipe(first())
      .subscribe((res) => this.setDataSource(res.data?.result));
  }

  private setDataSource(careers?: ICareer[]): void {
    if (careers) {
      const careersWithAction = careers.map((career) => ({
        ...career,
        action: COMMON_TABLE_ACTIONS,
      }));
      this.dataSource.data = careersWithAction;
    } else {
      this.dataSource.data = [];
    }
  }

  // BUTTONS
  public onActionAdd() {
    this.careerSelected = {} as ICareerTable;
    this.titlePopup = 'Añadir';
    this.buttonActive = TABLE_ACTIONS.ADD;
    this.patchValueToForm(this.buttonActive);
    this.togglePopup();
  }

  public onAction(item: ITableAction, element: ICareerTable): void {
    this.careerSelected = element;
    this.titlePopup = item.label;
    this.buttonActive = item.name;
    this.patchValueToForm(this.buttonActive);
    this.togglePopup();
  }

  private patchValueToForm(action: TABLE_ACTIONS): void {
    const { name, code, description, numberOfLevels, status } =
      this.careerSelected;
    this.careerForm.patchValue({
      name: action !== TABLE_ACTIONS.ADD ? name : '',
      code: action !== TABLE_ACTIONS.ADD ? code : '',
      description: action !== TABLE_ACTIONS.ADD ? description : '',
      numberOfLevels: action !== TABLE_ACTIONS.ADD ? numberOfLevels : '',
      status: action !== TABLE_ACTIONS.ADD ? status : '',
      // file: null,
    });
    if (action === TABLE_ACTIONS.VIEW) {
      this.careerForm.disable();
    } else {
      this.careerForm.enable();
    }
  }

  // POPUP
  public togglePopup(): void {
    this.classApplied = !this.classApplied;
  }

  public onClosePopup(): void {
    this.careerForm.reset();
    this.togglePopup();
  }

  //FORM
  private setCareerForm(): FormGroup {
    return this._formBuilder.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
      numberOfLevels: ['', [Validators.required, Validators.min(1)]],
      status: [''],
      // file: [null, [FileUploadValidators.filesLimit(1)]],
    });
  }

  public onSubmit(): void {
    if (this.careerForm.invalid) return;
    if (this.buttonActive === TABLE_ACTIONS.ADD) {
      this.onAddCareer();
    } else if (this.buttonActive === TABLE_ACTIONS.EDIT) {
      this.onEditCareer();
    } else if (this.buttonActive === TABLE_ACTIONS.DELETE) {
      this.onDeleteCareer();
    }
  }

  private onAddCareer(): void {
    const { name, code, description, numberOfLevels } = this.careerForm.value;
    this._careersService
      .register({ name, code, description, numberOfLevels })
      .pipe(first())
      .subscribe(() => this.afterProcessAction());
  }

  private onEditCareer(): void {
    const { id, name, code, description, numberOfLevels, status } =
      this.careerSelected;
    const formValues: Partial<ICareer> = this.careerForm.value;
    const careerSelectedValues: Partial<ICareer> = {
      name,
      code,
      description,
      numberOfLevels,
      status,
    };
    const keys: (keyof ICareer)[] = [
      'name',
      'code',
      'description',
      'numberOfLevels',
      'status',
    ];
    const updatedFields = this._dataComparisonService.compareAndUpdate<ICareer>(
      formValues,
      careerSelectedValues,
      keys
    );

    if (Object.keys(updatedFields).length > 0) {
      this._careersService
        .update(id, updatedFields)
        .pipe(first())
        .subscribe(() => this.afterProcessAction());
    }
  }

  private onDeleteCareer(): void {
    const { id } = this.careerSelected;
    this._careersService
      .delete(id)
      .pipe(first())
      .subscribe(() => this.afterProcessAction());
  }

  private afterProcessAction(): void {
    this.fetchCareers();
    this.onClosePopup();
  }
}

// private onAddCareer(): void {
//   const { name, code, description, numberOfLevels, file } =
//     this.careerForm.value;
//   const expectedHeaders = ['name', 'code', 'academicLevel'];
//   this._excelService
//     .readExcel<ISubject>(file as File[], expectedHeaders)
//     .then((subjects) => {
//       this._careersService
//         .register({ name, code, description, numberOfLevels, subjects })
//         .pipe(first())
//         .subscribe(() => this.afterProcessAction());
//     });
// }
