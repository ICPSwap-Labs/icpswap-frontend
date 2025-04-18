import { Flex, BodyCell } from "@icpswap/ui";

export function EmptyCell() {
  return (
    <Flex gap="0 8px" className="row-item">
      <BodyCell>--</BodyCell>
    </Flex>
  );
}
