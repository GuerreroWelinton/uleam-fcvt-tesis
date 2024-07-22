import { EducationalSpaceEntity } from "../entities";

export abstract class EducationalSpaceDataSource {
  abstract list(): Promise<EducationalSpaceEntity[]>;
}
