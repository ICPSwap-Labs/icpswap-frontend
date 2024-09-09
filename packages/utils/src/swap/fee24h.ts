export function calcFee24h(volumeUSD: number | string | undefined): number | undefined {
  if (!volumeUSD) return undefined;

  return (Number(volumeUSD) * 3) / 1000;
}
