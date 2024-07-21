import { IdBaseDto } from "../../dtos";
import { IApiResponse, ISubject } from "../../interfaces";
import { SubjectRepository } from "../../repositories";

interface FindByIdSubjectUseCase {
  execute(subjectId: IdBaseDto): Promise<Partial<IApiResponse<ISubject>>>;
}

export class FindByIdSubject implements FindByIdSubjectUseCase {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async execute(
    subjectId: IdBaseDto
  ): Promise<Partial<IApiResponse<ISubject>>> {
    const subject = await this.subjectRepository.findById(subjectId);
    const {
      id,
      name,
      code,
      academicLevel,
      career,
      status,
      createdAt,
      updatedAt,
    } = subject;

    return {
      message: "Asignatura encontrada con éxito",
      data: {
        result: {
          id,
          name,
          code,
          academicLevel,
          career: {
            id: career.id,
            name: career.name,
            code: career.code,
            numberOfLevels: career.numberOfLevels,
            description: career.description,
            status: career.status,
            createdAt: career.createdAt,
            updatedAt: career.updatedAt,
          },
          status,
          createdAt,
          updatedAt,
        },
      },
    };
  }
}
