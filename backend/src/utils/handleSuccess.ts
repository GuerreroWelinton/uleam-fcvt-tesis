import { Response } from "express";
import { IApiResponse } from "../domain/interfaces";

export const handleSuccess = <T>(
  apiResponse: Partial<IApiResponse<T>>,
  res: Response
): Response<IApiResponse<T>> => {
  const response: IApiResponse<T> = {
    code: 200,
    status: "success",
    message: apiResponse.message || "Operación realizada con éxito",
    data: apiResponse.data,
    token: apiResponse.token,
  };
  return res.status(response.code).json(response);
};
