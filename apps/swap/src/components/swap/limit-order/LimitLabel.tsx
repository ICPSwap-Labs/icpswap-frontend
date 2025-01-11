import { Typography } from "components/Mui";
import { Flex } from "@icpswap/ui";

export function LimitLabel() {
  return (
    <Flex
      justify="center"
      sx={{ width: "46px", height: "24px", borderRadius: "8px", background: "rgb(84 192 129 / 10%)" }}
    >
      <Typography color="text.success" fontSize="12px">
        Limit
      </Typography>
    </Flex>
  );
}
