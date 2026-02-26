/** Converts a nullable value to an optional arg: returns [value] if truthy, otherwise []. Commonly used for optional args in canister calls. */
export function optionalArg<T>(value: T | null | undefined): [T] | [] {
  return value ? [value] : [];
}
