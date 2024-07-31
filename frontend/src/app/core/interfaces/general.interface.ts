export interface IFilters {
  [param: string]:
    | string
    | number
    | boolean
    | readonly (string | number | boolean)[];
}
