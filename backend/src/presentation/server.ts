import express, { Router } from "express";
import cors from "cors";

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

    //Routes
    this.app.use(this.routes);

    //Listen
    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port} 🕹️`);
    });
  }
}
