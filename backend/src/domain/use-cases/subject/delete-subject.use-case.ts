import { IdBaseDto } from "../../dtos";
import { IApiResponse, ISubject } from "../../interfaces";
import { SubjectRepository } from "../../repositories";

interface DeleteSubjectUseCase {
  execute(subjectId: IdBaseDto): Promise<Partial<IApiResponse<ISubject>>>;
}

export class DeleteSubject implements DeleteSubjectUseCase {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async execute(
    subjectId: IdBaseDto
  ): Promise<Partial<IApiResponse<ISubject>>> {
    const subject = await this.subjectRepository.delete(subjectId);
    const { code } = subject;

    return {
      message: `Asignatura con el código ${code} se ha eliminado con éxito`,
    };
  }
}
