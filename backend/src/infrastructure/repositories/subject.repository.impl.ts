import { SubjectDataSource } from "../../domain/datasources";
import {
  CodeBaseDto,
  IdBaseDto,
  RegisterSubjectDto,
  UpdateSubjectDto,
} from "../../domain/dtos";
import { SubjectEntity } from "../../domain/entities";
import { SubjectRepository } from "../../domain/repositories";

export class SubjectRepositoryImpl implements SubjectRepository {
  constructor(private readonly subjectDataSource: SubjectDataSource) {}

  list(): Promise<SubjectEntity[]> {
    return this.subjectDataSource.list();
  }

  findById(subjectId: IdBaseDto): Promise<SubjectEntity> {
    return this.subjectDataSource.findById(subjectId);
  }

  findOneByCode(subjectCode: CodeBaseDto): Promise<SubjectEntity> {
    return this.subjectDataSource.findOneByCode(subjectCode);
  }

  register(registerSubjectDto: RegisterSubjectDto): Promise<SubjectEntity> {
    return this.subjectDataSource.register(registerSubjectDto);
  }

  delete(subjectId: IdBaseDto): Promise<SubjectEntity> {
    return this.subjectDataSource.delete(subjectId);
  }

  update(
    subjectId: IdBaseDto,
    updateSubjectDto: UpdateSubjectDto
  ): Promise<SubjectEntity> {
    return this.subjectDataSource.update(subjectId, updateSubjectDto);
  }
}
