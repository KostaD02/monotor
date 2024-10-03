export function isObjectEmpty(
  object: Record<string, unknown> | object,
): boolean {
  return Object.keys(object).length === 0;
}

export function isAllValueEmpty(value: Record<string, unknown>): boolean {
  return Object.values(value).every((v) => v === '');
}
