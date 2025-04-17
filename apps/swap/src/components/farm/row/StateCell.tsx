import { Flex, BodyCell } from "@icpswap/ui";
import type { FarmInfo, Null } from "@icpswap/types";

import { State } from "../State";

export interface StateCellProps {
  farmInfo: FarmInfo | Null;
}

export function StateCell({ farmInfo }: StateCellProps) {
  return (
    <Flex justify="flex-end" className="row-item">
      <State farmInfo={farmInfo} noState={<BodyCell>--</BodyCell>} />
    </Flex>
  );
}
