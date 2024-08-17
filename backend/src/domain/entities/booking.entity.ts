import { BOOKING_STATES } from "../../constants/constants";
import { EducationalSpaceEntity } from "./educational-space.entity";
import { SubjectEntity } from "./subject.entity";
import { UserEntity } from "./user.entity";

export class BookingEntity {
  constructor(
    public id: string,
    public startTime: Date,
    public endTime: Date,
    public topic: string,
    public observation: string,
    public teacher: UserEntity,
    public eduSpace: EducationalSpaceEntity,
    public subject: SubjectEntity,
    public participants: { userId: UserEntity; attended: boolean }[],
    public status: BOOKING_STATES,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
