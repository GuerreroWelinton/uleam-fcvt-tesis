import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store';
import { selectAuthUser } from '../../core/store/user/user.selectors';
import { CustomizerSettingsService } from '../../shared/components/customizer-settings/customizer-settings.service';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import {
  ApexChart,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import moment from 'moment';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  colors: string[];
  fill: ApexFill;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatMenuModule, MatButtonModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export default class DashboardComponent {
  public profile$ = this._store.select(selectAuthUser);

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  currentDate: Date;
  formattedDate: string;

  // private datePipe: DatePipe,
  constructor(
    private _store: Store<AppState>,
    public themeService: CustomizerSettingsService
  ) {
    this.currentDate = new Date();
    this.formattedDate = moment(this.currentDate).format('DD/MM/YYYY HH:mm');
    this.chartOptions = {
      series: [90],
      chart: {
        type: 'radialBar',
        height: 240,
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: '#19ce45',
            strokeWidth: '100%',
            margin: 3, // margin is in pixels
            dropShadow: {
              enabled: false,
            },
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              offsetY: -2,
              fontSize: '25px',
              fontWeight: 500,
              color: '#ffffff',
            },
          },
        },
      },
      colors: ['#ec1624'],
    };
  }
}
