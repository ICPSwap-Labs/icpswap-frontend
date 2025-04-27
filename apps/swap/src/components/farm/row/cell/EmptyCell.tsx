import { Flex, BodyCell } from "@icpswap/ui";

interface EmptyCellProps {
  justify?: "flex-start" | "flex-end";
}

export function EmptyCell({ justify }: EmptyCellProps) {
  return (
    <Flex gap="0 8px" className="row-item" justify={justify ?? "flex-end"}>
      <BodyCell>--</BodyCell>
    </Flex>
  );
}
