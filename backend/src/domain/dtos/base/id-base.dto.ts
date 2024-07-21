import { Validators } from "../../../config";

export class IdBaseDto {
  private constructor(public id: string) {}

  static create(object: { [key: string]: any }): [string?, IdBaseDto?] {
    const { id } = object;

    if (!id) return ["El id es requerido"];
    if (!Validators.id.test(id)) return ["El id no es válido"];

    return [undefined, new IdBaseDto(id)];
  }
}
