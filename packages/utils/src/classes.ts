/** Joins truthy class name fragments with a single space (simple `clsx`-style helper). */
export function classNames(classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
