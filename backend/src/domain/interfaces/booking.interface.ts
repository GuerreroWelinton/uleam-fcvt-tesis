import { BOOKING_STATES } from "../../constants/constants";
import { IBaseRecord } from "./api-response.interface";
import { IEducationalSpace } from "./educational-space.interface";
import { ISubject } from "./subject.interface";
import { IUser } from "./user.interface";

export interface IBooking extends IBaseRecord {
  startTime: Date;
  endTime: Date;
  topic: string;
  observation: string;
  teacher: IUser;
  eduSpace: IEducationalSpace;
  subject: ISubject;
  participants: { name: string; attended: boolean }[];
  status: BOOKING_STATES;
}
