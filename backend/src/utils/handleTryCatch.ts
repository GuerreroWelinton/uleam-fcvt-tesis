import { CustomError } from "../domain/errors";

export async function handleTryCatch<T>(
  callback: () => Promise<T>
): Promise<T> {
  try {
    return await callback();
  } catch (error) {
    console.log("🔴 ERROR 🔴");
    console.log(error);
    // Manejo de errores personalizado
    if (error instanceof CustomError) {
      throw error;
    }
    // Error no controlado por mí
    throw CustomError.internalServer();
  }
}
