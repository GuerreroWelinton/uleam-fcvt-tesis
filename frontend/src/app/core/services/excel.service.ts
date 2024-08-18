import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { AlertService } from './alert.service';

interface GenericObject {
  [key: string]: any;
}

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

          if (jsonData.length === 0) {
            this.alertService.showAlert({
              type: 'danger',
              message:
                'El archivo está vacío, por favor verifique el contenido',
            });
            reject(
              new Error(
                'El archivo está vacío, por favor verifique el contenido'
              )
            );
            return;
          }

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

  downloadExcel<T extends GenericObject>(
    data: T[],
    columnNames: { [key: string]: string },
    fileName: string
  ): void {
    if (data.length === 0) {
      this.alertService.showAlert({
        type: 'warning',
        message: 'No hay datos para descargar',
      });
      return;
    }

    // Obtener las claves del primer objeto (si existe)
    const keys = Object.keys(data[0]);

    // Filtrar claves que estén en columnNames
    const filteredKeys = keys.filter((key) => columnNames[key] !== undefined);

    // Transformar los datos para incluir solo las columnas deseadas
    const transformedData = data.map((item) => {
      const row: any = {};
      filteredKeys.forEach((key) => {
        const columnName = columnNames[key];
        // Si la columna especificada en columnNames es un campo anidado
        if (typeof columnName === 'string' && columnName.includes('.')) {
          row[columnName] = this.getNestedValue(item, key);
        } else {
          row[columnName || key] = item[key];
        }
      });
      return row;
    });

    // Crear una hoja de cálculo y un libro
    const ws = XLSX.utils.json_to_sheet(transformedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    // Descargar el archivo
    XLSX.writeFile(wb, fileName);

    // Mostrar alerta de éxito
    this.alertService.showAlert({
      type: 'success',
      message: `Archivo ${fileName} descargado exitosamente`,
    });
  }

  private getNestedValue(obj: GenericObject, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
}
