import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'shared-dialog-change-user-password',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialog-change-user-password.component.html',
})
export class DialogChangeUserPasswordComponent {}
