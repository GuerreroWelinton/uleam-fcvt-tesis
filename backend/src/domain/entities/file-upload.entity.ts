import { BASE_RECORD_STATES } from "../../constants/constants";

export class FileUploadEntity {
  constructor(
    public id: string,
    public originalName: string,
    public path: string,
    public mimetype: string,
    public size: number,
    public recordId: string,
    public status: BASE_RECORD_STATES,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
