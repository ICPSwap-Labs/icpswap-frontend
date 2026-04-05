/**
 * Stringifies enum-like values: returns strings as-is; for objects, the first own key name; otherwise coerces to string.
 */
export function enumToString(type: any): string {
  if (typeof type === "string") return type;

  if (typeof type === "object") {
    if (type) {
      return Object.keys(type)[0];
    }
  }

  return type as string;
}
