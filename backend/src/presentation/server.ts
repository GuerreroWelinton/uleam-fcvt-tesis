import cors from "cors";
import express, { Router } from "express";
import path from "path";
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
    
    console.log(path.join(__dirname, "../uploads"));
    console.log(`${API_VERSION_PATH}${MAIN_ENDPOINTS.UPLOADS}`);

    this.app.use(
      `${API_VERSION_PATH}${MAIN_ENDPOINTS.UPLOADS}`,
      express.static(path.join(__dirname, "../uploads"))
    );

    //Routes
    this.app.use(this.routes);

    //Listen
    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port} 🕹️`);
    });
  }
}
