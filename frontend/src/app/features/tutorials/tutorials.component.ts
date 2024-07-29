import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.scss',
})
export default class TutorialsComponent {}
