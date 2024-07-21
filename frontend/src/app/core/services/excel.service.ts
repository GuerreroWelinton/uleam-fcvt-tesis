import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor(private alertService: AlertService) {}

  readExcel<T>(files: File[], expectedHeaders: string[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!files || files.length === 0) {
        this.alertService.showAlert({
          type: 'warning',
          message: 'No se seleccionó ningún archivo',
        });
        reject(new Error('No se seleccionó ningún archivo'));
        return;
      }

      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target!.result;
          const data = new Uint8Array(arrayBuffer as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json<T>(worksheet, {
            raw: true,
          });

          if (
            !this.validateHeaders(
              Object.keys(jsonData[0] as object),
              expectedHeaders
            )
          ) {
            this.alertService.showAlert({
              type: 'danger',
              message:
                'Formato de archivo inválido: Las columnas no coinciden con el formato esperado',
            });
            reject(new Error('Formato de archivo inválido'));
            return;
          }

          resolve(jsonData);
        } catch (err) {
          this.alertService.showAlert({
            type: 'danger',
            message: 'Error al procesar el archivo',
          });
          reject(new Error(`Error al procesar el archivo: ${err}`));
        }
      };
      reader.onerror = (error) => {
        this.alertService.showAlert({
          type: 'danger',
          message: 'Error al leer el archivo',
        });
        reject(new Error(`Error al leer el archivo: ${error}`));
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private validateHeaders(
    headers: string[],
    expectedHeaders: string[]
  ): boolean {
    return expectedHeaders.every((header) => headers.includes(header));
  }
}
