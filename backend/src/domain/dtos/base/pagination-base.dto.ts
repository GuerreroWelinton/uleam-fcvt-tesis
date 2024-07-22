export class PaginationDto {
  private constructor(
    public page: number,
    public limit: number,
    public skip: number
  ) {
    this.page = page || 1;
    this.limit = limit || 10;
  }

  static create(object: { [key: string]: any }): [string?, PaginationDto?] {
    let { page, limit } = object;

    page = +page;
    limit = +limit;

    if (!page) return ["La página es requerida"];
    if (!limit) return ["El límite es requerido"];

    if (isNaN(page)) return ["La página debe ser un número"];
    if (isNaN(limit)) return ["El límite debe ser un número"];

    return [undefined, new PaginationDto(page, limit, (page - 1) * limit)];
  }
}
