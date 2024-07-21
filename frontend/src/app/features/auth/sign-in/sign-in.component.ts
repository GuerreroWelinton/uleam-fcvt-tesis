import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store';
import { UserActions } from '../../../core/store/user/user.actions';
import { CustomizerSettingsService } from '../../../shared/components/customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export default class SignInComponent {
  public passwordHidden: boolean = true;
  public signInForm!: FormGroup;

  constructor(
    public themeService: CustomizerSettingsService,
    private _formBuilder: FormBuilder,
    private _store: Store<AppState>
  ) {
    this.signInForm = this.setSignInForm();
  }

  private setSignInForm(): FormGroup<any> {
    return this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          // Validators.minLength(8),
          // Validators.pattern(PATTERNS.PASSWORD),
        ],
      ],
    });
  }

  public onSubmit(): void {
    if (this.signInForm.invalid) return;
    const email = this.signInForm.value.email as string;
    const password = this.signInForm.value.password as string;
    this._store.dispatch(UserActions.login({ email, password }));
  }
}
