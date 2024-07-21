export const API_VERSION_PATH = "/api/v1";

export const DAY_OF_WEEK = {
  MONDAY: "monday",
  TUESDAY: "tuesday",
  WEDNESDAY: "wednesday",
  THURSDAY: "thursday",
  FRIDAY: "friday",
  SATURDAY: "saturday",
  SUNDAY: "sunday",
};

export enum MAIN_ENDPOINTS {
  AUTH = "/auth",
  USERS = "/users",
  SUBJECTS = "/subjects",
  CAREERS = "/careers",
  BUILDINGS = "/buildings",
  EDUCATIONAL_SPACES = "/educational-spaces",
  PERIODS = "/periods",
}

export enum BASE_RECORD_STATES {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted",
}

export enum USER_ROLES {
  ADMIN = "admin",
  SUPERVISOR = "supervisor",
  TEACHER = "teacher",
  STUDENT = "student",
}
