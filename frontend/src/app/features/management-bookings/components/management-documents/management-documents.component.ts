import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import {
  FileUploadControl,
  FileUploadModule,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { finalize, map, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import {
  ACTION_BUTTON_ADD,
  ACTION_BUTTON_DELETE,
  ACTION_BUTTON_DOWNLOAD,
  DEFAULT_PAGE_SIZE,
} from '../../../../core/constants/component.constant';
import { TABLE_ACTIONS } from '../../../../core/enums/component.enum';
import { IApiResponse } from '../../../../core/interfaces/api-response.interface';
import { ITableAction } from '../../../../core/interfaces/component.interface';
import {
  IFileUpload,
  IFileUploadTable,
} from '../../../../core/interfaces/file-upload.interface';
import { FileDownloadService } from '../../../../core/services/file-download.service';
import { ManagementEducationalSpacesService } from '../../../../core/services/management-educational-spaces.service';
import { PopupContainerService } from '../../../../core/services/popup-container.service';
import { PreBookingService } from '../../../../core/services/pre-booking.service';
import { CustomizerSettingsService } from '../../../../shared/components/customizer-settings/customizer-settings.service';
import { MaxCharDirective } from '../../../../shared/directives/max-char.directive';
import { FileSizePipe } from '../../../../shared/pipes/file-size.pipe';
import { IEducationalSpace } from '../../../management-educational-spaces/interfaces/educational-spaces.interface';
import { BASE_RECORD_STATES } from '../../../../core/enums/general.enum';

@Component({
  selector: 'app-management-documents',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    JsonPipe,

    MatButtonModule,
    MatProgressBarModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatCardModule,
    MatInputModule,
    FileUploadModule,

    MaxCharDirective,

    FileSizePipe,
  ],
  templateUrl: './management-documents.component.html',
})
export class ManagementDocumentsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // POPUP
  @ViewChild('popupTemplate', { static: true })
  public popupTemplate: TemplateRef<HTMLElement> | null = null;
  public titlePopup: string = '';

  // TABLE
  public isLoading: boolean = false;
  public dataSource$: Observable<MatTableDataSource<IFileUploadTable>> = of(
    new MatTableDataSource<IFileUploadTable>([])
  );
  public displayedColumns = ['originalName', 'size', 'actions'];

  // PAGINATION
  @ViewChild(MatPaginator)
  public paginator: MatPaginator;
  public totalCount: number = 0;
  public defaultPageSize = DEFAULT_PAGE_SIZE;

  // BUTTONS
  public actionButtons = TABLE_ACTIONS;
  public actionButtonAdd = ACTION_BUTTON_ADD;
  public actionButtonDownload = ACTION_BUTTON_DOWNLOAD;
  public actionButtonDelete = ACTION_BUTTON_DELETE;
  public activeActionButton = ACTION_BUTTON_ADD;

  // FORM
  public filesForm: FormGroup;
  public selectedFile: IFileUploadTable | null = null;
  public selectedEduSpace: IEducationalSpace | null = null;

  // FILE
  public fileUploadControl: FileUploadControl;

  public isManagamentRoute: boolean = false;

  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public themeService: CustomizerSettingsService,
    private _popupContainerService: PopupContainerService,
    private _formBuilder: FormBuilder,
    private _eduSpaceService: ManagementEducationalSpacesService,
    private _fileDownloadService: FileDownloadService,
    private _preBookingService: PreBookingService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.isManagamentRoute = this.checkManagementRoute();

    this._preBookingService.getSelectedEduSpace().subscribe((eduSpace) => {
      this.selectedEduSpace = eduSpace;
    });

    this.dataSource$ = this.fetchFiles();
    this.filesForm = this.setForm(this.activeActionButton);

    this.fileUploadControl = new FileUploadControl(undefined, [
      FileUploadValidators.filesLimit(1),
      FileUploadValidators.fileSize(1048576),
      FileUploadValidators.accept(['.pdf']),
    ]);

    this.fileUploadControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value.length) {
          const file = value[0];
          const { name, size } = file;
          const mb = size / (1024 * 1024);
          const formattedMb = `${mb.toFixed(2)} MB`;
          this.filesForm.patchValue({ name, size: formattedMb });
        } else {
          this.filesForm.patchValue({ name: '', size: '' });
        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource$.pipe(
      tap((dataSource) => (dataSource.paginator = this.paginator))
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  private checkManagementRoute(): boolean {
    return this._router.url.includes('management-bookings');
  }

  // TABLE
  private fetchFiles(): Observable<MatTableDataSource<IFileUploadTable>> {
    if (!this.selectedEduSpace)
      return of(new MatTableDataSource<IFileUploadTable>([]));

    const { id } = this.selectedEduSpace;

    this.isLoading = true;
    return this._eduSpaceService
      .listPdf({ recordId: id, status: [BASE_RECORD_STATES.ACTIVE] })
      .pipe(
        map((res) => this.transformFilesResponse(res)),
        finalize(() => (this.isLoading = false))
      );
  }

  private transformFilesResponse(
    res: IApiResponse<IFileUpload[]>
  ): MatTableDataSource<IFileUploadTable> {
    this.totalCount = res.data?.totalCount || 0;
    const files = res.data?.result || [];
    const filesTable = files.map((file) => ({
      ...file,
      actions: [],
    }));

    return new MatTableDataSource<IFileUploadTable>(filesTable);
  }

  // BUTTONS
  public onActionButton(
    actionButton: ITableAction,
    rowSelected: IFileUploadTable | null
  ): void {
    this.initializeForm(actionButton, rowSelected);
    this.processAction(actionButton);
  }

  private processAction(actionButton: ITableAction): void {
    if (
      actionButton.name === TABLE_ACTIONS.ADD ||
      actionButton.name === TABLE_ACTIONS.DELETE ||
      !this.selectedFile
    ) {
      this.showPopup();
      return;
    }
    if (actionButton.name === TABLE_ACTIONS.DOWNLOAD) {
      const { originalName, path } = this.selectedFile;
      this.onDownloadFile(path, originalName);
    }
    return;
  }

  private onDownloadFile(filePath: string, fileName: string) {
    this._fileDownloadService.downloadFile(filePath).subscribe((blob) => {
      this._fileDownloadService.triggerDownload(blob, fileName);
    });
  }

  // FORM
  private initializeForm(
    actionButton: ITableAction,
    rowSelected: IFileUploadTable | null
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
      name: [{ value: '', disabled: true }],
      size: [{ value: '', disabled: true }],
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
    if (this.fileUploadControl.value.length && this.selectedEduSpace) {
      const { id } = this.selectedEduSpace;
      const file = this.fileUploadControl.value[0];
      this._eduSpaceService
        .uploadPdf(id, file)
        .subscribe(() => this.afterSubmit());
    }
  }

  private deleteFile(): void {
    if (this.selectedFile) {
      const { id } = this.selectedFile;
      this._eduSpaceService.deletePdf(id).subscribe(() => this.afterSubmit());
    }
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
    this.fileUploadControl.clear();
    this._popupContainerService.showTemplate(null);
    this._popupContainerService.tooglePopup(false);
  }
}
