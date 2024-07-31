import { Router } from "express";
import { API_VERSION_PATH, MAIN_ENDPOINTS } from "../constants/constants";
import { AuthRoutes } from "./auth/routes";
import { UserRoutes } from "./user/routes";
import { CareerRoutes } from "./career/routes";
import { SubjectRoutes } from "./subject/routes";
import { PeriodRoutes } from "./period/routes";
import { BuildingRoutes } from "./building/routes";
import { EducationalSpaceRoutes } from "./educational-space/routes";
import { BookingRoutes } from "./booking/routes";

export class AppRoutes {
  static get routes(): Router {
    
    const router = Router();

    //Here define main routes
    router.use(`${API_VERSION_PATH}${MAIN_ENDPOINTS.AUTH}`, AuthRoutes.routes);
    router.use(`${API_VERSION_PATH}${MAIN_ENDPOINTS.USERS}`, UserRoutes.routes);
    router.use(`${API_VERSION_PATH}${MAIN_ENDPOINTS.CAREERS}`, CareerRoutes.routes);
    router.use(`${API_VERSION_PATH}${MAIN_ENDPOINTS.SUBJECTS}`, SubjectRoutes.routes);
    router.use(`${API_VERSION_PATH}${MAIN_ENDPOINTS.PERIODS}`, PeriodRoutes.routes);
    router.use(`${API_VERSION_PATH}${MAIN_ENDPOINTS.BUILDINGS}`, BuildingRoutes.routes);
    router.use(`${API_VERSION_PATH}${MAIN_ENDPOINTS.EDUCATIONAL_SPACES}`, EducationalSpaceRoutes.routes);
    router.use(`${API_VERSION_PATH}${MAIN_ENDPOINTS.BOOKINGS}`, BookingRoutes.routes);
    
    return router;
  }
}
