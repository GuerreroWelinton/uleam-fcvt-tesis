import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { CustomizerSettingsService } from '../../../../shared/components/customizer-settings/customizer-settings.service';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { IApiData } from '../../../../core/interfaces/api-response.interface';
import { IBooking } from '../../../../core/interfaces/booking.interface';
import { OnBookingService } from '../../../../core/services/on-booking.service';
import { AsyncPipe, JsonPipe, PercentPipe } from '@angular/common';
import {
  BOOKING_STATES,
  USER_ROLES,
} from '../../../../core/enums/general.enum';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/store';
import { selectAuthUser } from '../../../../core/store/user/user.selectors';
import { IUser } from '../../../users/interfaces/user.interface';
import { IFilters } from '../../../../core/interfaces/general.interface';
import { ManagementEducationalSpacesService } from '../../../../core/services/management-educational-spaces.service';
import { ComunicationDashboardService } from '../../../../core/services/comunication-dashboard.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: any;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  colors: string[];
  tooltip: ApexTooltip;
  legend: ApexLegend;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};

@Component({
  selector: 'app-section-bookings',
  standalone: true,
  imports: [
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    RouterLink,
    NgApexchartsModule,
    AsyncPipe,
    JsonPipe,
    PercentPipe,
  ],
  templateUrl: './section-bookings.component.html',
  styleUrls: ['./section-bookings.component.scss'],
})
export class SectionBookingsComponent implements OnInit {
  @ViewChild('chartPie')
  public chartPie: ChartComponent;
  public chartPieOptions: Partial<ChartOptions>;

  @ViewChild('chartDonut')
  public chartDonut: ChartComponent;
  public chartDonutOptions: Partial<ChartOptions>;

  @ViewChild('chartBar')
  public chartBar: ChartComponent;
  public chartBarOptions: Partial<BarChartOptions>;

  public totalPending: number = 0;
  public totalApproved: number = 0;
  public totalRejected: number = 0;
  public totalConfirmed: number = 0;
  public totalBookings: number = 0;

  public pendingPercentage: number = 0;
  public rejectedPercentage: number = 0;
  public approvedPercentage: number = 0;
  public confirmedPercentage: number = 0;

  public menuOptions: { label: string; value: string }[] = [];
  public selectedMenuOption: { label: string; value: string } = {
    label: '',
    value: '',
  };

  public filter: IFilters = {
    status: [
      BOOKING_STATES.PENDING,
      BOOKING_STATES.APPROVED,
      BOOKING_STATES.REJECTED,
      BOOKING_STATES.CONFIRMED,
    ],
  };

  private user: IUser | null = null;
  private bookings$: Observable<IApiData<IBooking[]>> = of({
    result: [],
    totalCount: 0,
  });

  constructor(
    public themeService: CustomizerSettingsService,
    private _onBookingService: OnBookingService,
    private _store: Store<AppState>,
    private _eduSpaceService: ManagementEducationalSpacesService,
    private _comunicationDashboardService: ComunicationDashboardService
  ) {}

  ngOnInit(): void {
    // Inicializar la gráfica con valores por defecto
    this.chartPieOptions = this.setConfigChart([0, 0, 0, 0], 'pie');
    this.chartDonutOptions = this.setConfigChart([0, 0, 0, 0], 'donut');
    this.chartBarOptions = this.setConfigBarChart([0, 0, 0, 0]);
    // Realizar la consulta de reservas
    this.bookings$ = this.preFetchBookings();
    // Actualizar la gráfica con los datos obtenidos
    this.updateChartData();
  }

  private setConfigChart(series: number[], type: string): Partial<any> {
    return {
      series,
      chart: {
        type,
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
      },
      stroke: {
        width: 2,
        show: true,
      },
      labels: ['Pendientes', 'Rechazadas', 'Aprobadas', 'Confirmadas'],
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
        style: {
          fontSize: '14px',
        },
        dropShadow: {
          enabled: false,
        },
      },
      colors: ['#ffb264', '#e74c3c', '#2ed47e', '#00cae3'],
      tooltip: {
        y: {
          formatter: function (val: string) {
            return val + '%';
          },
        },
      },
    };
  }

  private setConfigBarChart(series: number[]): Partial<any> {
    return {
      series: [
        {
          name: 'Reservas',
          data: series,
        },
      ],
      chart: {
        type: 'bar',
      },
      colors: ['#ffb264', '#e74c3c', '#2ed47e', '#00cae3'],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true, // Cambia a true si quieres colores individuales por categoría
        },
      },
      dataLabels: {
        enabled: false,
        style: {
          fontSize: '14px',
        },
      },
      legend: {
        offsetY: 5,
        show: false,
        fontSize: '14px',
        position: 'bottom',
        horizontalAlign: 'center',
        labels: {
          colors: '#919aa3',
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      grid: {
        show: true,
        strokeDashArray: 5,
        borderColor: '#e0e0e0',
        row: {
          colors: ['#f4f6fc', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: ['Pendientes', 'Rechazadas', 'Aprobadas', 'Confirmadas'],
        labels: {
          show: false,
          style: {
            colors: ['#ffb264', '#e74c3c', '#2ed47e', '#00cae3'],
            fontSize: '14px',
          },
        },
        axisBorder: {
          show: false,
          color: '#e0e0e0',
        },
        axisTicks: {
          show: true,
          color: '#e0e0e0',
        },
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            colors: '#919aa3',
            fontSize: '14px',
          },
        },
        axisBorder: {
          show: false,
        },
      },
      // tooltip: {
      //   y: {
      //     formatter: function (val: string) {
      //       return val + '%';
      //     },
      //   },
      // },
    };
  }

  private preFetchBookings(): Observable<IApiData<IBooking[]>> {
    return this._store.select(selectAuthUser).pipe(
      switchMap((user: IUser | null) => {
        if (!user) {
          return of({ result: [], totalCount: 0 });
        }
        this.user = user;

        this.menuOptions = this.getMenuOptionsBasedOnRoles(user.roles);
        this.selectedMenuOption =
          this.menuOptions.length > 0
            ? this.menuOptions[0]
            : { label: '', value: '' };

        return this.fetchBookings(user);
      })
    );
  }

  private getMenuOptionsBasedOnRoles(
    roles: USER_ROLES[]
  ): { label: string; value: string }[] {
    const roleToMenuMap = {
      [USER_ROLES.ADMIN]: 'Administrador',
      [USER_ROLES.SUPERVISOR]: 'Supervisor',
      [USER_ROLES.TEACHER]: 'Profesor',
      [USER_ROLES.STUDENT]: 'Estudiante',
    };

    return roles
      .map((role) => ({ label: roleToMenuMap[role], value: role }))
      .filter((menu) => menu.label !== undefined);
  }

  private fetchBookings(user: IUser): Observable<IApiData<IBooking[]>> {
    if (this.selectedMenuOption.value === USER_ROLES.ADMIN) {
      return this._onBookingService
        .list(this.filter)
        .pipe(map((res) => res.data || { result: [], totalCount: 0 }));
    }

    if (this.selectedMenuOption.value === USER_ROLES.TEACHER) {
      this.filter = { ...this.filter, teacherId: user.id };
      return this._onBookingService
        .list(this.filter)
        .pipe(map((res) => res.data || { result: [], totalCount: 0 }));
    }

    if (this.selectedMenuOption.value === USER_ROLES.SUPERVISOR) {
      return this._eduSpaceService.listByUserId(user.id).pipe(
        switchMap((res) => {
          const eduSpaceIds =
            res.data?.result.map((eduSpace) => eduSpace.id) || [];
          this.filter = { ...this.filter, eduSpaceId: eduSpaceIds };
          return this._onBookingService
            .list(this.filter)
            .pipe(map((res) => res.data || { result: [], totalCount: 0 }));
        })
      );
    }

    return of({ result: [], totalCount: 0 });
  }

  private updateChartData(): void {
    this.bookings$
      .pipe(
        tap((res) => {
          this.totalPending = res.result.filter(
            (b) => b.status === BOOKING_STATES.PENDING
          ).length;
          this.totalRejected = res.result.filter(
            (b) => b.status === BOOKING_STATES.REJECTED
          ).length;
          this.totalApproved = res.result.filter(
            (b) => b.status === BOOKING_STATES.APPROVED
          ).length;
          this.totalConfirmed = res.result.filter(
            (b) => b.status === BOOKING_STATES.CONFIRMED
          ).length;

          this.totalBookings =
            this.totalPending +
            this.totalApproved +
            this.totalRejected +
            this.totalConfirmed;

          this._comunicationDashboardService.setValue(this.totalBookings);

          this.pendingPercentage = this.calculatePercentage(
            this.totalPending,
            this.totalBookings
          );
          this.rejectedPercentage = this.calculatePercentage(
            this.totalRejected,
            this.totalBookings
          );
          this.approvedPercentage = this.calculatePercentage(
            this.totalApproved,
            this.totalBookings
          );
          this.confirmedPercentage = this.calculatePercentage(
            this.totalConfirmed,
            this.totalBookings
          );

          this.chartPieOptions = this.setConfigChart(
            [
              this.pendingPercentage,
              this.rejectedPercentage,
              this.approvedPercentage,
              this.confirmedPercentage,
            ],
            'pie'
          );

          this.chartDonutOptions = this.setConfigChart(
            [
              this.pendingPercentage,
              this.rejectedPercentage,
              this.approvedPercentage,
              this.confirmedPercentage,
            ],
            'donut'
          );

          this.chartBarOptions = this.setConfigBarChart([
            this.totalPending,
            this.totalRejected,
            this.totalApproved,
            this.totalConfirmed,
          ]);
        })
      )
      .subscribe();
  }

  private calculatePercentage(value: number, total: number): number {
    return total === 0 ? 0 : parseFloat(((value / total) * 100).toFixed(2));
  }

  public onMenuOptionSelect(option: { label: string; value: string }): void {
    if (this.selectedMenuOption.value === option.value || !this.user) return;
    this.selectedMenuOption = option;

    // Re-configurar el filtro según la opción seleccionada
    this.filter = {
      status: [
        BOOKING_STATES.PENDING,
        BOOKING_STATES.APPROVED,
        BOOKING_STATES.REJECTED,
        BOOKING_STATES.CONFIRMED,
      ],
    };

    // Volver a realizar la consulta de reservas
    this.bookings$ = this.fetchBookings(this.user);

    // Actualizar la gráfica con los nuevos datos
    this.updateChartData();
  }
}
