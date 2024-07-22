import { BASE_RECORD_STATES } from "../../constants/constants";
import { EducationalSpaceModel } from "../../data/mongodb";
import { EducationalSpaceDataSource } from "../../domain/datasources";
import { EducationalSpaceEntity } from "../../domain/entities";
import { handleTryCatch } from "../../utils";
import { EducationalSpaceMapper } from "../mappers/educational-space.mapper";

export class EducationalSpaceDataSourceImpl
  implements EducationalSpaceDataSource
{
  constructor() {}

  async list(): Promise<EducationalSpaceEntity[]> {
    return handleTryCatch<EducationalSpaceEntity[]>(async () => {
      const educationalSpaces = await EducationalSpaceModel.find({
        status: { $ne: BASE_RECORD_STATES.DELETED },
      })
        .populate("buildingId")
        .populate("userId")
        .sort({ createdAt: -1 })
        .exec();

      return educationalSpaces.map((educationalSpace) => {
        return EducationalSpaceMapper.educationalSpaceEntityFromObject(
          educationalSpace
        );
      });
    });
  }
}
