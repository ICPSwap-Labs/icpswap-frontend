/** Returns the number of digits after the decimal point for a numeric string or number. */
export function getNumberDecimals(num: string | number) {
  const decimal = String(num).split(".")[1];

  return decimal ? decimal.length : 0;
}
