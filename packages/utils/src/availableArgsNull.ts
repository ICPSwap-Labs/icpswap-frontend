export function availableArgsNull<T>(value: T | null | undefined): [T] | [] {
  return value ? [value] : [];
}
