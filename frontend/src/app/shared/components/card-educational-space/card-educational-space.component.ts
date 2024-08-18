import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { IEducationalSpace } from '../../../features/management-educational-spaces/interfaces/educational-spaces.interface';

@Component({
  selector: 'shared-card-educational-space',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './card-educational-space.component.html',
})
export class CardEducationalSpaceComponent {
  @Input({ required: true })
  public eduSpaceData: IEducationalSpace;

  @Output()
  public seeCalendar: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public seeStatistics: EventEmitter<void> = new EventEmitter<void>();

  public emitSelected(): void {
    this.seeCalendar.emit();
  }

  public emitStatistics(): void {
    this.seeStatistics.emit();
  }
}
