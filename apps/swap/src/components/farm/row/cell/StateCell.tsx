import type { FarmInfo, Null } from "@icpswap/types";
import { BodyCell, Flex } from "@icpswap/ui";
import { State } from "components/farm/State";

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
