import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexStroke,
  ApexTooltip,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { CustomizerSettingsService } from '../../../../shared/components/customizer-settings/customizer-settings.service';
import { map, Observable, of, tap } from 'rxjs';
import { IApiData } from '../../../../core/interfaces/api-response.interface';
import { IBooking } from '../../../../core/interfaces/booking.interface';
import { OnBookingService } from '../../../../core/services/on-booking.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { BOOKING_STATES } from '../../../../core/enums/general.enum';

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
  ],
  templateUrl: './section-bookings.component.html',
  styleUrl: './section-bookings.component.scss',
})
export class SectionBookingsComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  private totalPending: number = 0;
  private totalApproved: number = 0;
  private totalRejected: number = 0;
  private totalConfirmed: number = 0;
  private totalBookings: number = 0;

  public bookingsPending$: Observable<IApiData<IBooking[]>> = of({
    result: [],
    totalCount: 0,
  });

  public bookingsRejected$: Observable<IApiData<IBooking[]>> = of({
    result: [],
    totalCount: 0,
  });

  public bookingsApproved$: Observable<IApiData<IBooking[]>> = of({
    result: [],
    totalCount: 0,
  });

  public bookingsConfirmed$: Observable<IApiData<IBooking[]>> = of({
    result: [],
    totalCount: 0,
  });

  constructor(
    public themeService: CustomizerSettingsService,
    private _onBookingService: OnBookingService
  ) {}

  ngOnInit(): void {
    this.chartOptions = this.setConfigChart([0, 0, 0, 0]);

    this.bookingsPending$ = this.fetchBookingsPending();
    this.bookingsApproved$ = this.fetchBookingsApproved();
    this.bookingsRejected$ = this.fetchBookingsRejected();
    this.bookingsConfirmed$ = this.fetchBookingsConfirmed();

    setTimeout(() => {
      this.totalBookings =
        this.totalPending +
        this.totalApproved +
        this.totalRejected +
        this.totalConfirmed;
      this.chartOptions = this.setConfigChart([
        (this.totalPending / this.totalBookings) * 100,
        (this.totalRejected / this.totalBookings) * 100,
        (this.totalApproved / this.totalBookings) * 100,
        (this.totalConfirmed / this.totalBookings) * 100,
      ]);
    }, 1000);
  }

  private fetchBookingsPending(): Observable<IApiData<IBooking[]>> {
    return this._onBookingService.list({ status: BOOKING_STATES.PENDING }).pipe(
      tap((res) => (this.totalPending = res.data?.totalCount || 0)),
      map((res) => res.data || { result: [], totalCount: 0 })
    );
  }

  private fetchBookingsRejected(): Observable<IApiData<IBooking[]>> {
    return this._onBookingService
      .list({ status: BOOKING_STATES.REJECTED })
      .pipe(
        tap((res) => (this.totalRejected = res.data?.totalCount || 0)),
        map((res) => res.data || { result: [], totalCount: 0 })
      );
  }

  private fetchBookingsApproved(): Observable<IApiData<IBooking[]>> {
    return this._onBookingService
      .list({ status: BOOKING_STATES.APPROVED })
      .pipe(
        tap((res) => (this.totalApproved = res.data?.totalCount || 0)),
        map((res) => res.data || { result: [], totalCount: 0 })
      );
  }

  private fetchBookingsConfirmed(): Observable<IApiData<IBooking[]>> {
    return this._onBookingService
      .list({ status: BOOKING_STATES.CONFIRMED })
      .pipe(
        tap((res) => (this.totalConfirmed = res.data?.totalCount || 0)),
        map((res) => res.data || { result: [], totalCount: 0 })
      );
  }

  private setConfigChart(series: number[]): Partial<any> {
    return {
      series: series,
      chart: {
        width: 355,
        type: 'pie',
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
}
