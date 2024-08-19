import { style } from '@angular/animations';
import { E } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';
import moment from 'moment';
import 'moment/locale/es';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private pdfDocument: any; // Variable para almacenar el PDF generado

  constructor() {}

  async generateReport(selectedBooking: any, imageUrl: string) {
    const image = await this.convertImageToBase64(imageUrl);
    const documentDefinition = this.createDocumentDefinition(
      selectedBooking,
      image
    );

    this.pdfDocument = pdfMake.createPdf(documentDefinition); // Guardar el documento PDF en la variable
  }

  getPdfDocument() {
    return this.pdfDocument;
  }

  private convertImageToBase64(
    url: string
  ): Promise<{ dataURL: string; width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const pdfWidth = 595.276; // Ancho estándar de una página A4 en puntos
          const pdfMargin = 40; // Margen izquierdo y derecho (20 + 20)
          const availableWidth = pdfWidth - pdfMargin; // Ancho disponible para la imagen

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imgWidth = img.width;
          const imgHeight = img.height;

          // Escalar la imagen proporcionalmente
          const scale = availableWidth / imgWidth;
          const scaledWidth = imgWidth * scale;
          const scaledHeight = imgHeight * scale;

          // Agregar 10 píxeles a la altura
          const adjustedHeight = scaledHeight + 20;

          const dataURL = canvas.toDataURL('image/png');
          resolve({ dataURL, width: scaledWidth, height: adjustedHeight });
        } else {
          reject(new Error('No se pudo obtener el contexto 2D del canvas'));
        }
      };
      img.onerror = (error) => reject(error);
    });
  }

  private createDocumentDefinition(
    selectedBooking: any,
    image: { dataURL: string; width: number; height: number }
  ): any {
    return {
      content: [
        this.addImage(image.dataURL, image.width),
        // this.addTitle(),
        this.addBookingDetails(selectedBooking),
        this.addObservations(selectedBooking),
        this.addParticipantsTable(selectedBooking),
      ],
      styles: this.getStyles(),
      defaultStyle: {
        font: 'Roboto',
      },
    };
  }

  private addImage(base64Image: string, width: number): any {
    return {
      image: base64Image,
      width: width,
      alignment: 'center',
      margin: [0, 0, 0, 20],
    };
  }

  private addBookingDetails(selectedBooking: any): any {
    const formattedDate = moment(selectedBooking.createdAt)
      .locale('es')
      .format('dddd, D [de] MMMM [de] YYYY');
    const formattedDateUppercase = formattedDate.toUpperCase();

    const formmatedStartTime = moment(selectedBooking.startTime).format(
      'HH:mm A'
    );
    const formmatedEndTime = moment(selectedBooking.endTime).format('HH:mm A');
    const {
      teacher: { name, lastName },
      subject: { career, name: nameSubject, academicLevel },
      participants,
      topic,
    } = selectedBooking;
    const formattedTeacher = `${name} ${lastName}`.toUpperCase();
    const formattedSubject = nameSubject.toUpperCase();
    const formattedCareer = career.name.toUpperCase();
    const formmattedLevel = academicLevel.toString().toUpperCase();
    const formattedParticipants = participants.length;
    const formmattedTopic = topic.toUpperCase();

    return [
      {
        columns: [
          {
            text: 'DOCENTE RESPONSABLE: ',
            style: 'detailsColumns',
            bold: true,
          },
          {
            text: formattedTeacher,
            decoration: 'underline',
            style: 'detailsColumns',
          },
        ],
      },
      {
        columns: [
          {
            text: 'FECHA DE PRÁCTICA: ',
            style: 'detailsColumns',
            bold: true,
          },
          {
            text: formattedDateUppercase,
            decoration: 'underline',
            style: 'detailsColumns',
          },
        ],
      },
      {
        columns: [
          {
            text: `HORA DE ENTRADA: `,
            style: 'detailsColumns',
            bold: true,
          },
          {
            text: formmatedStartTime,
            decoration: 'underline',
            style: 'detailsColumns',
          },
        ],
      },
      {
        columns: [
          {
            text: `HORA DE SALIDA: `,
            style: 'detailsColumns',
            bold: true,
          },
          {
            text: formmatedEndTime,
            decoration: 'underline',
            style: 'detailsColumns',
          },
        ],
      },
      {
        columns: [
          {
            text: `CARRERA: `,
            style: 'detailsColumns',
            bold: true,
          },
          {
            text: formattedCareer,
            decoration: 'underline',
            style: 'detailsColumns',
          },
        ],
      },
      {
        columns: [
          {
            text: `ASIGNATURA:  `,
            style: 'detailsColumns',
            bold: true,
          },
          {
            text: formattedSubject,
            decoration: 'underline',
            style: 'detailsColumns',
          },
        ],
      },
      {
        columns: [
          {
            text: `NIVEL: `,
            style: 'detailsColumns',
            bold: true,
          },
          {
            text: formmattedLevel,
            decoration: 'underline',
            style: 'detailsColumns',
          },
        ],
      },
      {
        columns: [
          {
            text: `N° DE PARTICIPANTES: `,
            style: 'detailsColumns',
            bold: true,
          },
          {
            text: formattedParticipants,
            decoration: 'underline',
            style: 'detailsColumns',
          },
        ],
      },
      {
        columns: [
          {
            text: `TEMA DE LA PRÁCTICA: `,
            style: 'detailsColumns',
            bold: true,
          },
          {
            text: formmattedTopic,
            decoration: 'underline',
            style: 'detailsColumns',
          },
        ],
      },
    ];
  }

  private addParticipantsTable(selectedBooking: any): any {
    // Agregar numeración en negrita
    const participantsData = selectedBooking.participants.map(
      (
        e: {
          userId: { name: string; identityDocument: string; lastName: string };
          attended: any;
        },
        index: number
      ) => [
        { text: (index + 1).toString(), bold: true, style: 'tableCell' },
        { text: `${e.userId.name} ${e.userId.lastName}`, style: 'tableCell' },
        { text: e.userId.identityDocument, style: 'tableCell' },
        { text: e.attended ? 'SI' : 'NO', style: 'tableCell' },
      ]
    );

    return {
      style: 'tableExample',
      table: {
        headerRows: 1,
        widths: ['auto', '*', '*', '*'],
        body: [
          [
            { text: 'Nº', style: 'tableHeader' },
            { text: 'NOMBRES Y APELLIDOS', style: 'tableHeader' },
            { text: 'IDENTIFICAIÓN', style: 'tableHeader' },
            { text: 'ASISTENCIA', style: 'tableHeader' },
          ],
          ...participantsData,
        ],
      },
      layout: {
        hLineColor: '#000000', // Color de la línea horizontal
        vLineColor: '#000000', // Color de la línea vertical
        hLineWidth: function (i: number, node: any) {
          return 0.5; // Grosor de las líneas horizontales
        },
        vLineWidth: function (i: number, node: any) {
          return 0.5; // Grosor de las líneas verticales
        },
        paddingLeft: function (i: number, node: any) {
          return 4; // Padding a la izquierda
        },
        paddingRight: function (i: number, node: any) {
          return 4; // Padding a la derecha
        },
        paddingTop: function (i: number, node: any) {
          return 2; // Padding arriba
        },
        paddingBottom: function (i: number, node: any) {
          return 2; // Padding abajo
        },
      },
    };
  }

  private addObservations(selectedBooking: any): any {
    return [
      { text: 'OBSERVACIONES:', style: 'detailsColumns', bold: true },
      {
        text: selectedBooking.observation,
        style: 'detailsColumns',
        decoration: 'underline',
      },
    ];
  }

  private getStyles(): any {
    return {
      detailsColumns: { fontSize: 11, margin: [0, 5, 0, 0] },
      tableExample: {
        margin: [0, 15, 0, 0],
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        margin: [4, 2, 4, 2],
      },
      tableCell: {
        fontSize: 11,
        margin: [4, 2, 4, 2],
      },
    };
  }
}
