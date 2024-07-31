import { Response } from "express";
import { IApiResponse } from "../domain/interfaces";
import { CustomError } from "../domain/errors";

export const createErrorResponse = (
  code: number,
  message: string
): IApiResponse<null> => {
  //Logger para almacenar los errores en la base de datos
  const response: IApiResponse<null> = { code, status: "error", message };
  return response;
};

export const handleError = (
  error: unknown,
  res: Response
): Response<IApiResponse<null>> => {
  if (error instanceof CustomError) {
    const response = createErrorResponse(error.statusCode, error.message);
    return res.status(error.statusCode).json(response);
  }
  const response = createErrorResponse(500, "Error interno del servidor");
  return res.status(500).json(response);
};
