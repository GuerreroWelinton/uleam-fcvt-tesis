import { AsyncPipe, NgClass } from '@angular/common';
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
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileUploadModule, FileUploadValidators } from '@iplab/ngx-file-upload';
import { catchError, first, forkJoin, map, Observable, of } from 'rxjs';

import {
  BASE_STATES_MAT_SELECT,
  BASE_STATES_OPTIONS,
  COMMON_TABLE_ACTIONS,
} from '../../core/constants/component.constant';
import { TEMPLATE_FILE_ROUTES } from '../../core/constants/general.constant';
import { TABLE_ACTIONS } from '../../core/enums/component.enum';
import { BASE_RECORD_STATES } from '../../core/enums/general.enum';
import {
  IMatSelectOption,
  ITableAction,
} from '../../core/interfaces/component.interface';
import { DataComparisonService } from '../../core/services/data-comparison.service';
import { ExcelService } from '../../core/services/excel.service';
import { CustomizerSettingsService } from '../../shared/components/customizer-settings/customizer-settings.service';
import { DownloadFileDirective } from '../../shared/directives/download-file.directive';
import { MaxCharDirective } from '../../shared/directives/max-char.directive';
import { MaxValueDirective } from '../../shared/directives/max-value.directive';
import { OnlyNumbersDirective } from '../../shared/directives/only-numbers.directive';
import { CareersService } from '../careers/services/careers.service';
import {
  DISPLAYED_COLUMNS_SUBJECTS,
  FILE_NAME_SUBJECTS,
} from './helpers/subjects.constant';
import { ISubject, ISubjectTable } from './interfaces/subjects.interface';
import { SubjectsService } from './services/subjects.service';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatPaginator,
    MatTableModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FileUploadModule,
    AsyncPipe,
    NgClass,
    DownloadFileDirective,
    MaxCharDirective,
    MaxValueDirective,
    OnlyNumbersDirective,
  ],
  templateUrl: './subjects.component.html',
  // styleUrl: './subjects.component.scss',
})
export default class SubjectsComponent implements OnInit {
  // TABLE
  @ViewChild(MatPaginator)
  public paginator: MatPaginator;
  public dataSource = new MatTableDataSource<ISubjectTable>([]);
  public DISPLAYED_COLUMNS: string[] = DISPLAYED_COLUMNS_SUBJECTS;
  public BASE_STATES_OPTIONS: any = BASE_STATES_OPTIONS;

  // BUTTONS
  public buttonActive: TABLE_ACTIONS = TABLE_ACTIONS.ADD;
  public TABLE_ACTIONS = TABLE_ACTIONS;

  // POPUP
  public classApplied: boolean = false;
  public titlePopup: string = '';

  // FORM
  public subjectForm: FormGroup;
  public careers$: Observable<IMatSelectOption<string>[]>;
  public BASE_STATES_MAT_SELECT = BASE_STATES_MAT_SELECT;
  public FILE_NAME: string = FILE_NAME_SUBJECTS;
  public TEMPLATE_FILE_ROUTES: string = TEMPLATE_FILE_ROUTES;
  private subjectSelected: ISubjectTable = {} as ISubjectTable;

  constructor(
    public themeService: CustomizerSettingsService,
    private _subjectsService: SubjectsService,
    private _careersService: CareersService,
    private _formBuilder: FormBuilder,
    private _excelService: ExcelService,
    private _dataComparisonService: DataComparisonService
  ) {
    this.subjectForm = this.setSubjectForm();
    this.careers$ = this.setCareers();
  }

  ngOnInit(): void {
    this.fetchSubjects();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // TABLE
  private fetchSubjects() {
    this._subjectsService
      .list()
      .pipe(first())
      .subscribe((res) => this.setDataSource(res.data?.result ?? []));
  }

  private setDataSource(subjects?: ISubject[]): void {
    if (subjects) {
      const subjectsWithAction = subjects.map((subject) => ({
        ...subject,
        action: COMMON_TABLE_ACTIONS,
      }));
      this.dataSource.data = subjectsWithAction;
    } else {
      this.dataSource.data = [];
    }
  }

  // BUTTONS
  public onActionAdd(): void {
    this.subjectSelected = {} as ISubjectTable;
    this.titlePopup = 'Añadir';
    this.buttonActive = TABLE_ACTIONS.ADD;
    this.patchValueToForm(this.buttonActive);
    this.togglePopup();
  }

  public onAction(item: ITableAction, element: ISubjectTable): void {
    this.subjectSelected = element;
    this.titlePopup = item.label;
    this.buttonActive = item.name;
    this.patchValueToForm(this.buttonActive);
    this.togglePopup();
  }

  private patchValueToForm(action: TABLE_ACTIONS): void {
    if (action === TABLE_ACTIONS.ADD) {
      this.subjectForm.patchValue({ careerId: '', file: null });
    } else {
      const { name, code, academicLevel, career, status } =
        this.subjectSelected;
      this.subjectForm.patchValue({
        name,
        code,
        academicLevel,
        careerId: career.id,
        status,
      });
    }
    if (action === TABLE_ACTIONS.VIEW) {
      this.subjectForm.disable();
    } else {
      this.subjectForm.enable();
    }
  }

  // POPUP
  public togglePopup(): void {
    this.classApplied = !this.classApplied;
  }

  public onClosePopup(): void {
    this.subjectForm.reset();
    this.togglePopup();
  }

  // FORM
  private setSubjectForm(): FormGroup {
    return this._formBuilder.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      academicLevel: ['', [Validators.required]],
      careerId: ['', [Validators.required]],
      status: ['', [Validators.required]],
      file: [null, [Validators.required, FileUploadValidators.filesLimit(1)]],
    });
  }

  private setCareers(): Observable<IMatSelectOption<string>[]> {
    return this._careersService.list().pipe(
      map((res) => res.data?.result ?? []),
      map((careers) =>
        careers
          .filter((career) => career.status === BASE_RECORD_STATES.ACTIVE)
          .map((career) => ({
            value: career.id,
            viewValue: career.name,
          }))
      ),
      catchError(() => of([]))
    );
  }

  public onSubmit(): void {
    if (this.buttonActive === TABLE_ACTIONS.ADD) {
      this.onAddCareer();
    } else if (this.buttonActive === TABLE_ACTIONS.EDIT) {
      this.onEditCareer();
    } else if (this.buttonActive === TABLE_ACTIONS.DELETE) {
      this.onDeleteCareer();
    }
  }

  private onAddCareer(): void {
    const { careerId, file } = this.subjectForm.value;
    const expectedHeaders: (keyof ISubject)[] = [
      'name',
      'code',
      'academicLevel',
    ];
    this._excelService
      .readExcel<ISubject>(file as File[], expectedHeaders)
      .then((subjects) => {
        const registerObservables = subjects.map((subject) => {
          const subjectWithCareerId = { ...subject, careerId };
          return this._subjectsService.register(subjectWithCareerId);
        });

        forkJoin(registerObservables).subscribe({
          next: (results) => this.afterProcessAction(),
          error: (error) => this.afterProcessAction(),
        });
      });
  }

  private onEditCareer(): void {
    const { id, name, code, academicLevel, status } = this.subjectSelected;
    const formValues: Partial<ISubject> = this.subjectForm.value;
    const subjectSelectedValues: Partial<ISubject> = {
      name,
      code,
      academicLevel,
      status,
    };
    const keys: (keyof ISubject)[] = [
      'name',
      'code',
      'academicLevel',
      'status',
    ];
    const updatedFields =
      this._dataComparisonService.compareAndUpdate<ISubject>(
        formValues,
        subjectSelectedValues,
        keys
      );
    if (Object.keys(updatedFields).length > 0) {
      const { careerId } = this.subjectForm.value;
      const updatedSubject = { ...updatedFields, careerId };
      this._subjectsService
        .update(id, updatedSubject)
        .pipe(first())
        .subscribe(() => this.afterProcessAction());
    }
  }

  private onDeleteCareer(): void {
    const { id } = this.subjectSelected;
    this._subjectsService
      .delete(id)
      .pipe(first())
      .subscribe(() => this.afterProcessAction());
  }

  private afterProcessAction(): void {
    this.fetchSubjects();
    this.onClosePopup();
  }
}
