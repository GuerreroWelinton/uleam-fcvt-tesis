import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import moment from 'moment';
import {
  ApexChart,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { AppState } from '../../../../core/store';
import { IUser } from '../../../users/interfaces/user.interface';
import { Observable, of } from 'rxjs';
import { selectAuthUser } from '../../../../core/store/user/user.selectors';
import { AsyncPipe } from '@angular/common';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  colors: string[];
  fill: ApexFill;
};

@Component({
  selector: 'app-section-welcome',
  standalone: true,
  imports: [MatCardModule, NgApexchartsModule, AsyncPipe],
  templateUrl: './section-welcome.component.html',
  styleUrls: ['./section-welcome.component.scss'],
})
export class SectionWelcomeComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  public user$: Observable<IUser | null> = of(null);

  private currentDate: Date;
  public formattedDate: string;

  constructor(private _store: Store<AppState>) {}

  ngOnInit(): void {
    this.user$ = this._store.select(selectAuthUser);
    this.currentDate = new Date();
    this.formattedDate = moment(this.currentDate).format('DD/MM/YYYY');

    const progressPercentage = this.calculateYearProgress(this.currentDate);
    this.chartOptions = this.setConfigChart(progressPercentage);
  }

  private calculateYearProgress(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const endOfYear = new Date(date.getFullYear() + 1, 0, 1);
    const totalDaysInYear =
      (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 3600 * 24);
    const daysPassed =
      (date.getTime() - startOfYear.getTime()) / (1000 * 3600 * 24);
    const progressPercentage = (daysPassed / totalDaysInYear) * 100;

    // Redondear a dos decimales
    return parseFloat(progressPercentage.toFixed(0));
  }

  private setConfigChart(progressPercentage: number): Partial<ChartOptions> {
    return {
      series: [progressPercentage],
      chart: {
        type: 'radialBar',
        // height: 200,
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: '#19ce45',
            strokeWidth: '100%',
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
