export function getNumberDecimals(num: string | number) {
  const decimal = String(num).split(".")[1];

  return decimal ? decimal.length : 0;
}
