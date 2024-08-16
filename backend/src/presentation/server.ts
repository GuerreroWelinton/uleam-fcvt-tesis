import cors from "cors";
import express, { Router } from "express";
import path from "path";
import fs from "fs";
import { API_VERSION_PATH, MAIN_ENDPOINTS } from "../constants/constants";

interface IOptions {
  port?: number;
  routes: Router;
}

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: IOptions) {
    const { port = 3100 } = options;
    const { routes } = options;
    this.port = port;
    this.routes = routes;
  }

  async start() {
    // Configuración de CORS - Acerlo en el constructor
    // const corsOptions = {
    //   origin: "http://example.com", // Reemplaza con tu dominio
    //   methods: ["GET", "POST", "PUT", "DELETE"],
    //   allowedHeaders: ["Content-Type", "Authorization"],
    // };

    //Middlewares
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Verificar y crear la carpeta 'uploads' si no existe
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log("Uploads directory created at:", uploadsDir);
    } else {
      console.log("Uploads directory already exists at:", uploadsDir);
    }

    // Servir archivos estáticos desde la carpeta 'uploads'
    this.app.use(
      `${API_VERSION_PATH}${MAIN_ENDPOINTS.UPLOADS}`,
      express.static(uploadsDir)
    );

    //Routes
    this.app.use(this.routes);

    //Listen
    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port} 🕹️`);
    });
  }
}
