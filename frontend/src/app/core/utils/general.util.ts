export function buildQueryParams<T>(filters: Partial<T>): string {
  return Object.keys(filters)
    .filter(
      (key) =>
        filters[key as keyof T] !== undefined &&
        filters[key as keyof T] !== null
    )
    .map(
      (key) => `${key}=${encodeURIComponent(String(filters[key as keyof T]))}`
    )
    .join('&');
}

export function convertToSchemaType<T>(
  data: Partial<T>,
  schema: Record<string, string>
): Partial<T> {
  const result: Partial<T> = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      switch (schema[key]) {
        case 'string':
          result[key] = String(data[key]) as T[Extract<keyof T, string>];
          break;
        case 'number':
          result[key] = Number(data[key]) as T[Extract<keyof T, string>];
          break;
        case 'boolean':
          result[key] = Boolean(data[key]) as T[Extract<keyof T, string>];
          break;
        // Agrega más casos según sea necesario
        default:
          result[key] = data[key]; // Sin conversión
      }
    }
  }
  return result;
}
