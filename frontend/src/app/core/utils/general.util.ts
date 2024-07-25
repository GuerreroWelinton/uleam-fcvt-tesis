export function buildQueryParams<T>(filters: Partial<T>): string {
  return Object.keys(filters)
    .flatMap((key) => {
      const value = filters[key as keyof T];
      if (Array.isArray(value)) {
        return value.map(
          (item) => `${key}=${encodeURIComponent(String(item))}`
        );
      } else {
        return `${key}=${encodeURIComponent(String(value))}`;
      }
    })
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
