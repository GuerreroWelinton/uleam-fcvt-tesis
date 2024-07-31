import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { catchError, map, Observable, of } from 'rxjs';
import { BASE_LEVEL_SELECT } from '../../../core/constants/component.constant';
import { BASE_RECORD_STATES } from '../../../core/enums/general.enum';
import { IMatSelectOption } from '../../../core/interfaces/component.interface';
import { AppState } from '../../../core/store';
import { selectAuthUser } from '../../../core/store/user/user.selectors';
import { CareersService } from '../../../features/careers/services/careers.service';
import { SubjectsService } from '../../../features/subjects/services/subjects.service';

@Component({
  selector: 'app-form-reservation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    AsyncPipe,
  ],
  templateUrl: './form-reservation.component.html',
  styleUrls: ['./form-reservation.component.css']
})

export class FormReservationComponent implements OnInit {

  reservationForm: FormGroup;
  baseStatesOptions = BASE_LEVEL_SELECT;
  public careers$: Observable<IMatSelectOption<string>[]>;
  public subjectsOptions: any = [];
  // public subjects$: Observable<IMatSelectOption<string>[]>;
  public subjects: any = [];
  profil: any;
  public profile$ = this._store.select(selectAuthUser).pipe(
    map((res) => res ?? []),
    map((profile: any) => {
      this.profil = profile;
      return { value: profile.id, viewValue: profile.name, }
    }),
    catchError(() => of([]))
  ).subscribe();

  constructor(
    private _store: Store<AppState>,
    private _formBuilder: FormBuilder,
    private _careersService: CareersService,
    private _subjectsService: SubjectsService,

    private dialogRef: MatDialogRef<FormReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public arg: any,
  ) {
    this.initForm();
    this.careers$ = this.setCareers();
    this.setSubjects();
  }

  ngOnInit() {
    let date = moment(this.arg.startStr).format('YYYY-MM-DD');
    let start = moment(this.arg.startStr).format('HH:mm A');
    let end = moment(this.arg.endStr).format('HH:mm A');
    this.reservationForm.get('date')?.patchValue(date);
    this.reservationForm.get('start_hour')?.patchValue(start);
    this.reservationForm.get('end_hour')?.patchValue(end);
    this.reservationForm.get('userId')?.patchValue(this.profil.id);
    this.reservationForm.get('user')?.patchValue(this.profil.name + ' ' + this.profil.lastName);
    console.log(this.profil);
    let _start = moment(this.arg.startStr).format('YYYY-MM-DD HH:mm:ss');
    let _end = moment(this.arg.endStr).format('YYYY-MM-DD HH:mm:ss');
    this.reservationForm.get('start_date')?.patchValue(_start);
    this.reservationForm.get('end_date')?.patchValue(_end);
  }

  initForm() {
    this.reservationForm = this._formBuilder.group({
      date: new FormControl('', Validators.required),
      start_hour: new FormControl('', Validators.required),
      end_hour: new FormControl('', Validators.required),
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
      user: new FormControl('', Validators.required),
      userId: new FormControl('', Validators.required),
      careerId: new FormControl('', Validators.required),
      subject: new FormControl('', Validators.required),
      academicLevel: new FormControl('', Validators.required),
      number_students: new FormControl('', Validators.required),

      topic: new FormControl('', Validators.required),
      observation: new FormControl(''),
    });
  }

  private setCareers(): Observable<IMatSelectOption<string>[]> {
    return this._careersService.list().pipe(
      map((res) => res.data?.result ?? []),
      map((careers) =>
        careers
          .filter((career) => career.status === BASE_RECORD_STATES.ACTIVE)
          .map((career) => ({
            value: career.id,
            viewValue: career.name,
          }))
      ),
      catchError(() => of([]))
    );
  }

  public onBuildingChange($event: MatSelectChange): void {
    const { value } = $event;
    this.reservationForm.patchValue({ subject: '', academicLevel: '' });
    this.subjects.forEach((subject: any) => {
      if (subject.careerId === value) {
        this.subjectsOptions.push(subject);
      }
    });
  }

  public onBuildingChangeSubject($event: MatSelectChange): void {
    const { value } = $event;
    this.reservationForm.patchValue({ academicLevel: '' });
    this.subjects.forEach((subject: any) => {
      if (subject.id === value) {
        this.reservationForm.patchValue({ academicLevel: subject.academicLevel });
      }
    });
  }

  private setSubjects() {
    this._subjectsService.list().pipe(
      map((res) => res.data?.result ?? []),
      map((subjects) =>
        subjects
          .filter((subject) => subject.status === BASE_RECORD_STATES.ACTIVE)
          .map((subject) => {
            this.subjects.push({
              id: subject.id,
              name: subject.name,
              careerId: subject.career.id,
              academicLevel: subject.academicLevel,
            });
            return { value: subject.id, viewValue: subject.name, }
          })
      ),
      catchError(() => of([]))
    ).subscribe();
  }

  close(): void {
    this.dialogRef.close('Some data from modal');
  }

  onSubmit() {
    if (this.reservationForm.invalid) return;
    console.log(this.reservationForm.value);
  }

}
