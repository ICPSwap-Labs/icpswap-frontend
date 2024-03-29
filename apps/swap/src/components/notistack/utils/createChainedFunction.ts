/* eslint-disable @typescript-eslint/no-empty-function */
// @ts-nocheck
export default function createChainedFunction(funcs) {
  return funcs.reduce(
    (acc, func) => {
      if (func == null) return acc;

      if (process.env.NODE_ENV !== "production") {
        if (typeof func !== "function") {
          // eslint-disable-next-line no-console
          console.error("Invalid Argument Type. must only provide functions, undefined, or null.");
        }
      }

      return function chainedFunction(...args) {
        const argums = [...args];
        acc.apply(this, argums);
        func.apply(this, argums);
      };
    },
    () => {},
  );
}
