import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgClass, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Alert, AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgClass, NgStyle],
  template: `
    @for(alert of alerts; track $index) {
    <div
      [@slideInOut]="'in'"
      [ngClass]="
        'alert alert-bg-' +
        alert.type +
        ' d-flex justify-content-between align-items-center'
      "
      [ngStyle]="{ top: '12px' }"
      role="alert"
    >
      {{ alert.message }}
      <button
        type="button"
        class="close bg-transparent text-white p-0 border-none"
        aria-label="Close"
        (click)="dismissAlert(alert)"
      >
        <i class="ri-close-line"></i>
      </button>
    </div>
    }
  `,
  styles: [
    `
      .alert {
        position: fixed;
        margin-left: 12px;
        right: 12px;
        z-index: 1050;
        transition: opacity 0.5s ease-in-out, top 0.5s ease-in-out;

        .close {
          margin-left: 20px;
        }
      }
    `,
  ],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translateX(0)',
          opacity: 1,
        })
      ),
      transition('void => *', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in'),
      ]),
      transition('* => void', [
        animate(
          '300ms ease-out',
          style({ transform: 'translateX(100%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class AlertComponent implements OnInit {
  alerts: Alert[] = [];

  constructor(private _alertService: AlertService) {}

  ngOnInit() {
    this._alertService.alerts$.subscribe((alerts) => {
      this.alerts = alerts;
    });
  }

  public dismissAlert(alert: Alert) {
    this._alertService.dismissAlert(alert, true);
  }
}
