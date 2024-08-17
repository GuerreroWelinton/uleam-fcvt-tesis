export interface IApiResponse<T> {
  code: number; // Código de estado HTTP
  status: 'success' | 'error';
  message: string; // Mensaje relacionado con el estado
  data?: IApiData<T>; // Datos en caso de éxito
  token?: string; // Token opcional, solo cuando sea necesario
}

export interface IApiData<T> {
  result: T;
  totalCount?: number;
}

export interface IBaseRecord {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
