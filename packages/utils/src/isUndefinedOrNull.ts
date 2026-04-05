/** Returns true when `argument` is `null` or `undefined`. */
export function isUndefinedOrNull<T>(argument: T | undefined | null): argument is undefined | null {
  return argument === null || argument === undefined;
}

/** Returns true when `argument` is neither `null` nor `undefined`. */
export function nonUndefinedOrNull<T>(argument: T | undefined | null): argument is T {
  return !isUndefinedOrNull(argument);
}

/** Returns true when `argument` is `null`, `undefined`, or the empty string. */
export function isUndefinedOrNullOrEmpty<T>(argument: T | undefined | null): argument is undefined | null {
  return argument === null || argument === undefined || argument === "";
}
