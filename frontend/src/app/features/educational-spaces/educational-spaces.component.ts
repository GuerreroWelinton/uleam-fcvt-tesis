import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
// import { WorkingScheduleComponent } from '../../daxa/dashboard/project-management/working-schedule/working-schedule.component';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FileUploadModule } from '@iplab/ngx-file-upload';

import { map, Observable, of } from 'rxjs';
import {
  BASE_STATES_OPTIONS,
  COMMON_TABLE_ACTIONS,
} from '../../core/constants/component.constant';
import { BASE_RECORD_STATES } from '../../core/enums/general.enum';
import { TableCheckboxService } from '../../core/services/table-checkbox.service';
import { TableFilterService } from '../../core/services/table-filter.service';
import { CustomizerSettingsService } from '../../shared/components/customizer-settings/customizer-settings.service';
import { IEducationalSpace } from '../management-educational-spaces/interfaces/educational-spaces.interface';
import { ManagementEducationalSpacesService } from '../management-educational-spaces/services/management-educational-spaces.service';

@Component({
  selector: 'app-educational-spaces',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    // WorkingScheduleComponent,
    MatMenuModule,
    FullCalendarModule,
    CommonModule,
    MatFormFieldModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    FileUploadModule,
  ],
  templateUrl: './educational-spaces.component.html',
  styleUrl: './educational-spaces.component.scss',
})
export default class EducationalSpacesComponent implements OnInit {
  public eduSpaces$: Observable<IEducationalSpace[]> = of([]);

  public showCalendar: boolean = false;

  public toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  // File Uploader
  public multiple: boolean = false;

  // Calendar
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridWeek',
    locale: 'es',

    // dayMaxEvents: true, // when too many events in a day, show the popover
    weekends: true,
    events: [
      // {
      //     title: 'Meeting with Developers',
      //     date: '2024-05-02',
      // },
      // {
      //     title: 'Consultation with Employees',
      //     date: '2024-05-06',
      // },
      // {
      //     title: 'Call for payment Project NOK',
      //     date: '2024-05-18',
      // },
      // {
      //     title: 'Meeting with UI/UX Designers',
      //     date: '2024-05-22',
      // },
      // {
      //     title: 'Consultation with Doctor',
      //     date: '2024-05-26',
      // },
      // {
      //     title: 'Meeting with Developers',
      //     date: '2024-06-03',
      // },
      // {
      //     title: 'Consultation with Employees',
      //     date: '2024-07-07',
      // },
      // {
      //     title: 'Call for payment Project NOK',
      //     date: '2024-08-17',
      // },
      // {
      //     title: 'Meeting with UI/UX Designers',
      //     date: '2024-09-22',
      // },
      // {
      //     title: 'Consultation with Doctor',
      //     date: '2024-10-29',
      // },
    ],
    plugins: [dayGridPlugin],
  };

  constructor(
    public themeService: CustomizerSettingsService,
    private readonly _tableFilterSvc: TableFilterService,
    private readonly _tableCheckboxSvc: TableCheckboxService,
    private _educationalSpacesService: ManagementEducationalSpacesService
  ) {}

  ngOnInit(): void {
    this.eduSpaces$ = this.fetchEducationalSpaces();
  }

  public dataSource: MatTableDataSource<any, MatPaginator> =
    new MatTableDataSource<any>(ELEMENT_DATA);

  public displayedColumns: string[] = COLUMNS;

  public selection: SelectionModel<any> = new SelectionModel<any>(true, []);

  public statusOptions: any = BASE_STATES_OPTIONS;

  private fetchEducationalSpaces(): Observable<IEducationalSpace[]> {
    return this._educationalSpacesService
      .list()
      .pipe(map((res) => res.data?.result || []));
  }

  // Filter
  public applyFilter(event: Event): void {
    this._tableFilterSvc.applyFilter<any>(event, this.dataSource);
  }

  // Checkbox
  public isAllSelected(): boolean {
    return this._tableCheckboxSvc.isAllSelected<any>(
      this.selection,
      this.dataSource
    );
  }

  public toggleAllRows(): void {
    this.selection = this._tableCheckboxSvc.toggleAllRows<any>(
      this.selection,
      this.dataSource
    );
  }

  public checkboxLabel(row?: any): string {
    return this._tableCheckboxSvc.checkboxLabel<any, 'id'>(
      this.selection,
      this.dataSource,
      'id',
      row
    );
  }
}

const ELEMENT_DATA = [
  {
    id: 1,
    teacher: 'John Doe',
    startDate: '2022-01-01 08:00:00',
    endDate: '2022-01-01 12:00:00',
    status: BASE_RECORD_STATES.INACTIVE,
    action: COMMON_TABLE_ACTIONS,
  },
  {
    id: 2,
    teacher: 'John Doe',
    startDate: '2022-01-01 08:00:00',
    endDate: '2022-01-01 12:00:00',
    status: BASE_RECORD_STATES.ACTIVE,
    action: COMMON_TABLE_ACTIONS,
  },
  {
    id: 3,
    teacher: 'John Doe',
    startDate: '2022-01-01 08:00:00',
    endDate: '2022-01-01 12:00:00',
    status: BASE_RECORD_STATES.ACTIVE,
    action: COMMON_TABLE_ACTIONS,
  },
];

export const COLUMNS = [
  'select',
  'id',
  'teacher',
  'startDate',
  'endDate',
  'status',
  'action',
];
