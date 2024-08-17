import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import multer from "multer";
import path from "path";
import { createErrorResponse } from "../../utils";

const UPLOAD_DIR = path.join(__dirname, "../../uploads");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB en bytes

async function ensureUploadDirExists() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error("Error al crear el directorio de subida:", error);
  }
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadDirExists();
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE }, // Agregamos el límite de tamaño
});

export class FileUploadMiddleware {
  private static handleUpload = (
    req: Request,
    res: Response,
    next: NextFunction,
    allowedMimeTypes?: string[]
  ) => {
    upload.single("file")(req, res, (err: any) => {
      if (!req.file) {
        return res
          .status(400)
          .json(createErrorResponse(400, "El archivo es requerido"));
      }

      if (allowedMimeTypes && !allowedMimeTypes.includes(req.file.mimetype)) {
        return res
          .status(400)
          .json(createErrorResponse(400, "El tipo de archivo no es permitido"));
      }

      if (err && err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json(
            createErrorResponse(
              400,
              "El archivo excede el tamaño máximo permitido (5 MB)"
            )
          );
      }

      if (err) {
        return res
          .status(400)
          .json(
            createErrorResponse(
              400,
              "Error al subir el archivo, comuníquese con el administrador del sistema"
            )
          );
      }

      req.file.path = path.join("uploads", req.file.filename);

      next();
    });
  };

  static uploadSingleFile = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    FileUploadMiddleware.handleUpload(req, res, next);
  };

  static uploadPdfFile = (req: Request, res: Response, next: NextFunction) => {
    FileUploadMiddleware.handleUpload(req, res, next, ["application/pdf"]);
  };
}
