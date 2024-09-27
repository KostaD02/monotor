export function isObjectEmpty(
  object: Record<string, unknown> | object
): boolean {
  return Object.keys(object).length === 0;
}
