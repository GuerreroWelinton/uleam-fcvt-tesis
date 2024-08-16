import { IEducationalSpace } from '../../features/management-educational-spaces/interfaces/educational-spaces.interface';
import { ISubject } from '../../features/subjects/interfaces/subjects.interface';
import { IUser } from '../../features/users/interfaces/user.interface';
import { BOOKING_STATES } from '../enums/general.enum';
import { IBaseRecord } from './api-response.interface';

export interface IBooking extends IBaseRecord {
  startTime: Date;
  endTime: Date;
  topic: string;
  observation: string;
  teacher: IUser;
  eduSpace: IEducationalSpace;
  subject: ISubject;
  participants: { name: string; attended: boolean; _id: string }[];
  status: BOOKING_STATES;
}
