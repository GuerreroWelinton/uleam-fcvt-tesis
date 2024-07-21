import { RegisterSubjectDto } from "../../dtos";
import { IApiResponse, ISubject } from "../../interfaces";
import { SubjectRepository } from "../../repositories";

interface RegisterSubjectUseCase {
  execute(
    registerSubjectDto: RegisterSubjectDto
  ): Promise<Partial<IApiResponse<ISubject>>>;
}

export class RegisterSubject implements RegisterSubjectUseCase {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async execute(
    registerSubjectDto: RegisterSubjectDto
  ): Promise<Partial<IApiResponse<ISubject>>> {
    const subject = await this.subjectRepository.register(registerSubjectDto);
    const { code } = subject;

    return {
      message: `Asignatura con el código ${code} se ha registrado con éxito`,
    };
  }
}
