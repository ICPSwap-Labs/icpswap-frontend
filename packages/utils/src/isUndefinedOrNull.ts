/** Is null or undefined */
export function isUndefinedOrNull<T>(argument: T | undefined | null): argument is undefined | null {
  return argument === null || argument === undefined;
}

/** Not null and not undefined */
export function nonUndefinedOrNull<T>(argument: T | undefined | null): argument is T {
  return !isUndefinedOrNull(argument);
}

export function isUndefinedOrNullOrEmpty<T>(argument: T | undefined | null): argument is undefined | null {
  return argument === null || argument === undefined || argument === "";
}
