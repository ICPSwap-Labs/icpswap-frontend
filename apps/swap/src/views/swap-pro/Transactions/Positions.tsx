import { Null } from "@icpswap/types";
import { PositionTable } from "components/liquidity/index";

export interface PositionsProps {
  poolId: string | Null;
}

export function Positions({ poolId }: PositionsProps) {
  return <PositionTable poolId={poolId} />;
}
