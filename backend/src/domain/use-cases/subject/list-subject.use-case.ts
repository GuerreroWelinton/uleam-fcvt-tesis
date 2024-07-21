import { IApiResponse, ISubject } from "../../interfaces";
import { SubjectRepository } from "../../repositories";

interface ListSubjectUseCase {
  execute(): Promise<Partial<IApiResponse<ISubject[]>>>;
}

export class ListSubject implements ListSubjectUseCase {
  constructor(private readonly subjectRepository: SubjectRepository) {}
  async execute(): Promise<Partial<IApiResponse<ISubject[]>>> {
    const subjects = await this.subjectRepository.list();

    return {
      message: `Asignaturas encontradas con éxito`,
      data: {
        result: subjects.map((subject) => {
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
          };
        }),
      },
    };
  }
}
