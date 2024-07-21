import { Validators } from "../../../config";

export class CodeBaseDto {
  private constructor(public code: string) {}

  static create(object: { [key: string]: any }): [string?, CodeBaseDto?] {
    const { code } = object;

    if (!code) return ["El código es requerido"];

    return [undefined, new CodeBaseDto(code)];
  }
}
