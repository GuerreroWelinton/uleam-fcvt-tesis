import { EducationalSpaceEntity } from "../entities";

export abstract class EducationalSpaceRepository {
  abstract list(): Promise<EducationalSpaceEntity[]>;
}
