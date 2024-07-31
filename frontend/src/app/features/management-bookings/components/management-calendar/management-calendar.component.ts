import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  CalendarOptions,
  EventClickArg,
  EventSourceInput,
} from '@fullcalendar/core';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import {
  BASE_CALENDAR_OPTIONS,
  BOOKING_STATES_OPTIONS,
} from '../../../../core/constants/component.constant';
import { BOOKING_STATES } from '../../../../core/enums/general.enum';
import { IBooking } from '../../../../core/interfaces/booking.interface';
import { OnBookingService } from '../../../../core/services/on-booking.service';
import { PopupContainerService } from '../../../../core/services/popup-container.service';
import 'moment/locale/es';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-management-calendar',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    FullCalendarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './management-calendar.component.html',
  styles: `
  .test {
    color: red
  }
  `,
})
export class ManagementCalendarComponent implements OnInit, OnDestroy {
  // POPUP
  @ViewChild('popupTemplate', { static: true })
  public popupTemplate: TemplateRef<HTMLElement> | null = null;

  // FULLCALENDAR
  public calendarOptions = BASE_CALENDAR_OPTIONS;
  public selectedBooking: IBooking = {} as IBooking;
  private bookings: IBooking[] = [];

  // FROM
  public bookingForm: FormGroup;
  public bookingStates = BOOKING_STATES;
  public bookingStatesOptions = BOOKING_STATES_OPTIONS;

  // AUX
  private unsubscribe$ = new Subject<boolean>();

  constructor(
    private _popupContainerService: PopupContainerService,
    private _onBookingService: OnBookingService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.calendarOptions = this.setCalendarOptions();
    this.fetchBookings();
    this.bookingForm = this.initializeForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  // FULLCALENDAR
  private setCalendarOptions(): CalendarOptions {
    return {
      ...this.calendarOptions,
      editable: false,
      eventClick: (arg) => this.handleClickEvent(arg),
    };
  }

  private handleClickEvent(arg: EventClickArg) {
    const { event } = arg;
    const booking = this.bookings.find((b) => b.id === event.id);
    if (!booking) return;
    this.selectedBooking = booking;
    this.populateForm(this.selectedBooking);
    this.showPopup();
  }

  private fetchBookings(): void {
    this._onBookingService
      .list()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.bookings = res.data?.result || [];
        this.calendarOptions.events = this.setEvents(this.bookings);
      });
  }

  private setEvents(bookings: IBooking[]): EventSourceInput {
    return bookings
      .filter((booking) => booking.status !== BOOKING_STATES.REJECTED)
      .map((booking) => ({
        id: booking.id,
        title: booking.subject.name,
        start: booking.startTime,
        end: booking.endTime,
        backgroundColor: BOOKING_STATES_OPTIONS[booking.status].color,
        borderColor: BOOKING_STATES_OPTIONS[booking.status].color,
      }));
  }

  // FORM
  private initializeForm(): FormGroup {
    return this._formBuilder.group({
      date: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      teacher: ['', [Validators.required]],
      building: ['', [Validators.required]],
      eduSpace: ['', [Validators.required]],
      career: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      academicLevel: ['', [Validators.required]],
      number_participants: ['', [Validators.required]],
      topic: ['', [Validators.required]],
      observation: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  private populateForm(booking: IBooking): void {
    const { startTime, endTime } = booking;

    const date = moment(startTime).format('DD-MM-YYYY');
    const startTimeFormat = moment(startTime).format('HH:mm A');
    const endTimeFormat = moment(endTime).format('HH:mm A');

    this.bookingForm.patchValue({
      date: date,
      startTime: startTimeFormat,
      endTime: endTimeFormat,
      teacher: `${booking.teacher.name} ${booking.teacher.lastName}`,
      building: booking.eduSpace.building.name,
      eduSpace: booking.eduSpace.name,
      career: booking.subject.career.name,
      subject: booking.subject.name,
      academicLevel: booking.subject.academicLevel,
      number_participants: booking.participants.length,
      topic: booking.topic,
      observation: booking.observation,
      status: this.bookingStatesOptions[booking.status].label,
    });
  }

  public approveBooking(): void {
    if (this.bookingForm.invalid) return;
    const { id } = this.selectedBooking;
    console.log('Change status to approved');
    this.afterSubmitForm();
  }

  public rejectBooking(): void {
    if (this.bookingForm.invalid) return;
    const { id } = this.selectedBooking;
    console.log('Change status to rejected');
    this.afterSubmitForm();
  }

  private afterSubmitForm(): void {
    this.hidePopup();
    this.fetchBookings();
  }

  // POPUP
  public showPopup() {
    this._popupContainerService.showTemplate(this.popupTemplate);
    this._popupContainerService.tooglePopup(true);
  }

  public hidePopup() {
    this._popupContainerService.showTemplate(null);
    this._popupContainerService.tooglePopup(false);
  }

  // REPORT
  public generateReport() {
    // TODO: Esto debe generar un reporte con la data de la reserva seleccionada
    console.log(this.selectedBooking);

    let participants: any = [];
    let participants2: any = [{ text: 'NOMBRES', style: 'tableHeader' }, { text: 'ASISTENCIA', style: 'tableHeader' }];
    this.selectedBooking.participants.forEach(e => {
      participants.push(e.name + ' ' + (e.attended ? 'ASISTIO' : 'NO ASISTIO'));
    });

    const participantsData = this.selectedBooking.participants.map(e => [
      e.name,
      e.attended ? 'ASISTIO' : 'NO ASISTIO'
    ]);

    const documentDefinition: any = {
      content: [
        {
          text: 'REGISTRO DE PRÁCTICAS DEL LABORATORIO DE BIOLOGÍA',
          alignment: 'center',
          style: 'subheader'
        },
        {
          columns: [
            {
              text: 'Fecha de práctica: ' + moment(this.selectedBooking.createdAt).locale('es').format('dddd, D [de] MMMM [de] YYYY')
            },
          ]
        },
        {
          columns: [
            {
              text: 'Hora de entrada: ' + moment(this.selectedBooking.startTime).format('HH:mm A')
            },
            {
              text: 'Hora de salida: ' + moment(this.selectedBooking.endTime).format('HH:mm A')
            },
          ]
        },
        'Docente responsable: ',
        {
          columns: [
            {
              text: 'Carrera: ' + this.selectedBooking.subject.career.name
            },
            {
              text: 'Asignatura: ' + this.selectedBooking.subject.name
            },
          ]
        },
        {
          columns: [
            {
              text: 'Nivel: ' + this.selectedBooking.subject.academicLevel
            },
            {
              text: 'N° de estudiantes: ' + this.selectedBooking.participants.length
            },
          ]
        },
        'TEMA DE LA PRÁCTICA: ' + this.selectedBooking.topic,

        // { text: 'PARTICIPANTES', style: 'subheader' },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            body: [
              [{ text: 'NOMBRES', style: 'tableHeader' }, { text: 'ASISTENCIA', style: 'tableHeader' }],
              ...participantsData
            ]
          },
          layout: 'noBorders'
        },
        {
          alignment: 'justify',
          columns: [
            {
              text: 'NOTA: Para la utilizacion de los laboratorios deberá ser entregado este documento totalmente lleno y con tre dias de anticipación previ a la utilizacion de los mismos.'
            },
          ]
        },
        { text: 'OBSERVACIONES', style: 'title' },
        { text: this.selectedBooking.observation },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        title: {
          fontSize: 12,
          bold: true,
          margin: [0, 5, 0, 0]
        },
        tableExample: {
          fontSize: 12,
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
    };
    // pdfMake.createPdf(documentDefinition).download('sample.pdf');
    const pdf = pdfMake.createPdf(documentDefinition);
    pdf.open();

    this.hidePopup();
  }
}
