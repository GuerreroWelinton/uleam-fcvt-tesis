import { PaginationDto } from "../base/pagination-base.dto";

export class ListBookingDto {
  private constructor(
    // public pagination: PaginationDto,
    public id?: string,
    public topic?: string,
    public startTime?: Date,
    public endTime?: Date,
    public observation?: string,
    public teacherId?: string,
    public eduSpaceId?: string,
    public studentsId?: string[],
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  static create(object: { [key: string]: any }): [string?, ListBookingDto?] {
    // const [error, pagination] = PaginationDto.create(object);
    // if (error) return [error];

    const {
      id,
      topic,
      startTime,
      endTime,
      observation,
      teacherId,
      eduSpaceId,
      studentsId,
      createdAt,
      updatedAt,
    } = object;

    return [
      undefined,
      new ListBookingDto(
        // pagination!,
        id,
        topic,
        startTime,
        endTime,
        observation,
        teacherId,
        eduSpaceId,
        studentsId,
        createdAt,
        updatedAt
      ),
    ];
  }
}
