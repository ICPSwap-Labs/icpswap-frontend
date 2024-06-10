/** Is null or undefined */
export function isNullArgs<T>(argument: T | undefined | null): argument is undefined | null {
  return argument === null || argument === undefined;
}

/** Not null and not undefined */
export function nonNullArgs<T>(argument: T | undefined | null): argument is T {
  return !isNullArgs(argument);
}
