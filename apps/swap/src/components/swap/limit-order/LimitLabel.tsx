import { Typography } from "components/Mui";
import { Flex } from "@icpswap/ui";

export function LimitLabel() {
  return (
    <Flex sx={{ background: "rgb(84 192 129 / 10%)", borderRadius: "8px", padding: "6px 9px" }}>
      <Typography color="text.success" fontSize="12px">
        Limit
      </Typography>
    </Flex>
  );
}
