import { CodeBaseDto } from "../../dtos";
import { IApiResponse, ISubject } from "../../interfaces";
import { SubjectRepository } from "../../repositories";

interface FindOneByCodeSubjectUseCase {
  execute(subjectCode: CodeBaseDto): Promise<Partial<IApiResponse<ISubject>>>;
}

export class FindOneByCodeSubject implements FindOneByCodeSubjectUseCase {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async execute(
    subjectCode: CodeBaseDto
  ): Promise<Partial<IApiResponse<ISubject>>> {
    const subject = await this.subjectRepository.findOneByCode(subjectCode);
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
