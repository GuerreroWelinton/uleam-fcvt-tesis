import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { map, Observable, of, tap } from 'rxjs';
import {
  ACTION_BUTTON_ADD,
  DEFAULT_PAGE_SIZE,
} from '../../../../core/constants/component.constant';
import { TABLE_ACTIONS } from '../../../../core/enums/component.enum';
import {
  IFiles,
  IFilesTable,
  ITableAction,
} from '../../../../core/interfaces/component.interface';
import { PopupContainerService } from '../../../../core/services/popup-container.service';
import { CustomizerSettingsService } from '../../../../shared/components/customizer-settings/customizer-settings.service';
import { MaxCharDirective } from '../../../../shared/directives/max-char.directive';

@Component({
  selector: 'app-management-documents',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,

    MatButtonModule,
    MatProgressBarModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatCardModule,
    MatInputModule,
    FileUploadModule,

    MaxCharDirective,
  ],
  templateUrl: './management-documents.component.html',
})
export class ManagementDocumentsComponent implements OnInit, AfterViewInit {
  // POPUP
  @ViewChild('popupTemplate', { static: true })
  public popupTemplate: TemplateRef<HTMLElement> | null = null;
  public titlePopup: string = '';

  // TABLE
  public isLoading: boolean = false;
  public dataSource$: Observable<MatTableDataSource<IFilesTable>> = of(
    new MatTableDataSource<IFilesTable>([])
  );
  public displayedColumns = ['name', 'size', 'actions'];

  // PAGINATION
  @ViewChild(MatPaginator)
  public paginator: MatPaginator;
  public totalCount: number = 0;
  public defaultPageSize = DEFAULT_PAGE_SIZE;

  // BUTTONS
  public actionButtons = TABLE_ACTIONS;
  public actionButtonAdd = ACTION_BUTTON_ADD;
  public activeActionButton = ACTION_BUTTON_ADD;

  // FORM
  public filesForm: FormGroup;
  public selectedFile: IFilesTable | null = null;

  constructor(
    public themeService: CustomizerSettingsService,
    private _popupContainerService: PopupContainerService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dataSource$ = this.fetchFiles();
    this.filesForm = this.setForm(this.activeActionButton);
  }

  ngAfterViewInit(): void {
    this.dataSource$.pipe(
      tap((dataSource) => (dataSource.paginator = this.paginator))
    );
  }

  // TABLE
  private fetchFiles(): Observable<MatTableDataSource<IFilesTable>> {
    // this.isLoading = true;
    return of(filesData).pipe(
      map((res) => {
        this.totalCount = res.length;
        const files = res.map((file) => ({
          ...file,
          actions: [
            { label: 'Descargar', name: TABLE_ACTIONS.DOWNLOAD },
            { label: 'Eliminar', name: TABLE_ACTIONS.DELETE },
          ],
        }));
        return new MatTableDataSource<IFilesTable>(files);
      }),
      tap((dataSource) => (dataSource.paginator = this.paginator))
      // finalize(() => (this.isLoading = false))
    );
  }

  // BUTTONS
  public onActionButton(
    actionButton: ITableAction,
    rowSelected: IFilesTable | null
  ): void {
    this.processAction(actionButton);
    this.initializeForm(actionButton, rowSelected);
  }

  private processAction(actionButton: ITableAction): void {
    if (
      actionButton.name === TABLE_ACTIONS.ADD ||
      actionButton.name === TABLE_ACTIONS.DELETE
    ) {
      this.showPopup();
    }
    if (actionButton.name === TABLE_ACTIONS.DOWNLOAD) {
      console.log('DOWNLOAD FILE ...');
    }
    return;
  }

  // FORM
  private initializeForm(
    actionButton: ITableAction,
    rowSelected: IFilesTable | null
  ): void {
    this.activeActionButton = actionButton;
    this.titlePopup = actionButton.label;
    this.selectedFile = rowSelected;
    this.filesForm = this.setForm(actionButton);
  }

  private setForm(actionButton: ITableAction): FormGroup {
    if (actionButton.name !== TABLE_ACTIONS.ADD) {
      return this._formBuilder.group({});
    }
    return this._formBuilder.group({
      name: ['', [Validators.required]],
      size: [''],
    });
  }

  public onSubmit(): void {
    if (this.filesForm.invalid) return;
    const action = this.handlerSubmit(this.activeActionButton);
    if (action) action();
  }

  private handlerSubmit(actionButton: ITableAction): (() => void) | undefined {
    const actionMap = new Map<TABLE_ACTIONS, () => void>([
      [TABLE_ACTIONS.ADD, () => this.addFile()],
      [TABLE_ACTIONS.DELETE, () => this.deleteFile()],
    ]);
    return actionMap.get(actionButton.name);
  }

  private addFile(): void {
    console.log('ADD FILE ...');
    this.afterSubmit();
  }

  private deleteFile(): void {
    console.log('DELETE FILE ...');
    this.afterSubmit();
  }

  private afterSubmit(): void {
    this.dataSource$ = this.fetchFiles();
    this.hidePopup();
  }

  // POPUP
  public showPopup() {
    this._popupContainerService.showTemplate(this.popupTemplate);
    this._popupContainerService.tooglePopup(true);
  }

  public hidePopup() {
    this._popupContainerService.showTemplate(null);
    this._popupContainerService.tooglePopup(false);
  }
}

const filesData: IFiles[] = [
  {
    name: 'Reglamento interno',
    size: '1.3 MB',
  },
  {
    name: 'Código de conducta',
    size: '1.4 MB',
  },
  {
    name: 'Guía de uso de instalaciones',
    size: '1.6 MB',
  },
  {
    name: 'Procedimientos de emergencia',
    size: '1.7 MB',
  },
  {
    name: 'Manual de usuario',
    size: '1.8 MB',
  },
  {
    name: 'Políticas de seguridad',
    size: '1.9 MB',
  },
  {
    name: 'Normas de convivencia',
    size: '2.1 MB',
  },
];