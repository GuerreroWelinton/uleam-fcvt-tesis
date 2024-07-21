import {
  CodeBaseDto,
  IdBaseDto,
  RegisterSubjectDto,
  UpdateSubjectDto,
} from "../dtos";
import { SubjectEntity } from "../entities";

export abstract class SubjectDataSource {
  abstract list(): Promise<SubjectEntity[]>;

  abstract findById(subjectId: IdBaseDto): Promise<SubjectEntity>;

  abstract findOneByCode(subjectCode: CodeBaseDto): Promise<SubjectEntity>;

  abstract register(
    registerSubjectDto: RegisterSubjectDto
  ): Promise<SubjectEntity>;

  abstract delete(subjectId: IdBaseDto): Promise<SubjectEntity>;

  abstract update(
    subjectId: IdBaseDto,
    updateSubjectDto: UpdateSubjectDto
  ): Promise<SubjectEntity>;
}
