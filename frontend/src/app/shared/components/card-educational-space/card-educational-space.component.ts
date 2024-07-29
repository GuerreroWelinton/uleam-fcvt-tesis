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
  public selectedEduSpace: EventEmitter<IEducationalSpace> =
    new EventEmitter<IEducationalSpace>();

  public emitSelected(): void {
    this.selectedEduSpace.emit(this.eduSpaceData);
  }
}
