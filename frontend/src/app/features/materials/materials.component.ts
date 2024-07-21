import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-materials',
    standalone: true,
    imports: [MatCardModule],
    templateUrl: './materials.component.html',
    styleUrl: './materials.component.scss',
})
export class MaterialsComponent {}
