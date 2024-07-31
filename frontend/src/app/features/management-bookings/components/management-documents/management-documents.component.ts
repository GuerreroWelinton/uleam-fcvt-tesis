import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize, map, Observable, of, tap } from 'rxjs';
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

@Component({
  selector: 'app-management-documents',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatProgressBarModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatCardModule,
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
    this.isLoading = true;
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
      tap((dataSource) => (dataSource.paginator = this.paginator)),

      finalize(() => (this.isLoading = false))
    );
  }

  // FORM
  public onActionButton(
    actionButton: ITableAction,
    rowSelected: IFilesTable | null
  ): void {
    this.initializeForm(actionButton, rowSelected);
    this.processAction(actionButton);
  }

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
      size: ['', [Validators.required]],
    });
  }

  private processAction(actionButton: ITableAction): void {
    if (
      actionButton.name === TABLE_ACTIONS.ADD ||
      actionButton.name === TABLE_ACTIONS.DELETE
    ) {
      this.showPopup();
    }
    return;
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
    name: 'Document 1',
    size: '1.2 MB',
  },
  {
    name: 'Document 2',
    size: '1.5 MB',
  },
  {
    name: 'Document 3',
    size: '1.1 MB',
  },
  {
    name: 'Document 4',
    size: '1.3 MB',
  },
  {
    name: 'Document 5',
    size: '1.4 MB',
  },
];
