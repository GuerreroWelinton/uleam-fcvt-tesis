import { IdBaseDto, UpdateSubjectDto } from "../../dtos";
import { IApiResponse, ISubject } from "../../interfaces";
import { SubjectRepository } from "../../repositories";

interface UpdaateSubjectUseCase {
  execute(
    subjectId: IdBaseDto,
    updateSubjectDto: UpdateSubjectDto
  ): Promise<Partial<IApiResponse<ISubject>>>;
}

export class UpdateSubject implements UpdaateSubjectUseCase {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async execute(
    subjectId: IdBaseDto,
    updateSubjectDto: UpdateSubjectDto
  ): Promise<Partial<IApiResponse<ISubject>>> {
    const subject = await this.subjectRepository.update(
      subjectId,
      updateSubjectDto
    );

    return {
      message: `Asignatura se ha actualizado con éxito`,
    };
  }
}
