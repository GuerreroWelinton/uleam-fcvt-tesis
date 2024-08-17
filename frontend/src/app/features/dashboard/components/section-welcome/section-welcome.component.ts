import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import moment from 'moment';
import {
  ApexChart,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

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
  imports: [MatCardModule, NgApexchartsModule],
  templateUrl: './section-welcome.component.html',
  styleUrl: './section-welcome.component.scss',
})
export class SectionWelcomeComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  private currentDate: Date;
  public formattedDate: string;

  constructor() {}

  ngOnInit(): void {
    this.currentDate = new Date();
    this.formattedDate = moment(this.currentDate).format('DD/MM/YYYY HH:mm');
    this.chartOptions = this.setConfigChart();
  }

  private setConfigChart(): Partial<ChartOptions> {
    return {
      series: [100],
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
