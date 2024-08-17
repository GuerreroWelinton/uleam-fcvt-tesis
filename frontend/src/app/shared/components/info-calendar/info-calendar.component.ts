import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { BOOKING_STATES_OPTIONS } from '../../../core/constants/component.constant';

@Component({
  selector: 'app-info-calendar',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './info-calendar.component.html',
  styleUrl: './info-calendar.component.scss',
})
export class InfoCalendarComponent {
  public BOOKING_STATES_OPTIONS = Object.values(BOOKING_STATES_OPTIONS).slice(
    0,
    -1
  );
}
