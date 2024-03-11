/** Is null or undefined */
export const isNullArgs = <T>(
  argument: T | undefined | null
): argument is undefined | null => argument === null || argument === undefined;

/** Not null and not undefined */
export const nonNullArgs = <T>(argument: T | undefined | null): argument is T =>
  !isNullArgs(argument);
