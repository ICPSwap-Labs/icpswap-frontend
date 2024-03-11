export function sortToken(token0: string, token1: string) {
  return token0 > token1 ? { token0: token1, token1: token0 } : { token0, token1 };
}
