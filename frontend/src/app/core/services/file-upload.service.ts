import { Injectable } from '@angular/core';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor() {}

  createFileUploadControl(): FileUploadControl {
    return new FileUploadControl(undefined, [
      FileUploadValidators.filesLimit(1), // 1 file
      FileUploadValidators.fileSize(1048576), // 1 MB
      FileUploadValidators.accept(['.xlsx', '.xls']), // Excel files
    ]);
  }
}
