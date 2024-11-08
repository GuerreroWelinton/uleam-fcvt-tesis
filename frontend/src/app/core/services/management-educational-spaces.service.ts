import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.dev';
import { BASE_ENDPOINTS, MAIN_ENDPOINTS } from '../enums/endpoints.enum';
import { IApiResponse } from '../interfaces/api-response.interface';
import { AlertService } from './alert.service';
import { IEducationalSpace } from '../../features/management-educational-spaces/interfaces/educational-spaces.interface';
import { IFilters } from '../interfaces/general.interface';
import { IFileUpload } from '../interfaces/file-upload.interface';

@Injectable({
  providedIn: 'root',
})
export class ManagementEducationalSpacesService {
  private baseUrl: string = `  ${environment.API_URL}${MAIN_ENDPOINTS.EDUCATIONAL_SPACES}`;

  constructor(
    private _httpClient: HttpClient,
    private _alertService: AlertService
  ) {}

  public list(): Observable<IApiResponse<IEducationalSpace[]>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.LIST}`;
    return this._httpClient.get<IApiResponse<IEducationalSpace[]>>(endpoint);
  }

  public register(
    educationalSpace: Partial<IEducationalSpace>
  ): Observable<IApiResponse<IEducationalSpace>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.REGISTER}`;
    return this._httpClient
      .post<IApiResponse<IEducationalSpace>>(endpoint, educationalSpace)
      .pipe(tap((res) => this.showAlert(res)));
  }

  public delete(id: string): Observable<IApiResponse<IEducationalSpace>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.DELETE}/${id}`;
    return this._httpClient
      .delete<IApiResponse<IEducationalSpace>>(endpoint)
      .pipe(tap((res) => this.showAlert(res)));
  }

  public update(
    id: string,
    educationalSpace: object
  ): Observable<IApiResponse<IEducationalSpace>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.UPDATE}/${id}`;
    return this._httpClient
      .patch<IApiResponse<IEducationalSpace>>(endpoint, educationalSpace)
      .pipe(tap((res) => this.showAlert(res)));
  }

  public listByUserId(
    id: string
  ): Observable<IApiResponse<IEducationalSpace[]>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.LIST_BY_USER}/${id}`;
    return this._httpClient.get<IApiResponse<IEducationalSpace[]>>(endpoint);
  }

  public listPdf(filters: IFilters): Observable<IApiResponse<IFileUpload[]>> {
    const params = new HttpParams({ fromObject: filters });
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.LIST_PDF}`;
    return this._httpClient.get<IApiResponse<IFileUpload[]>>(endpoint, {
      params,
    });
  }

  public uploadPdf(
    id: string,
    file: File
  ): Observable<IApiResponse<IFileUpload>> {
    const formData = new FormData();
    formData.append('file', file);
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.UPLOAD_PDF}/${id}`;
    return this._httpClient
      .post<IApiResponse<IFileUpload>>(endpoint, formData)
      .pipe(tap((res) => this.showAlert(res)));
  }

  public deletePdf(id: string): Observable<IApiResponse<IFileUpload>> {
    const endpoint: string = `${this.baseUrl}${BASE_ENDPOINTS.DELETE_PDF}/${id}`;
    return this._httpClient
      .delete<IApiResponse<IFileUpload>>(endpoint)
      .pipe(tap((res) => this.showAlert(res)));
  }

  private showAlert(res: IApiResponse<IEducationalSpace | IFileUpload>): void {
    this._alertService.showAlert({
      type: 'success',
      message: res.message,
    });
  }
}
