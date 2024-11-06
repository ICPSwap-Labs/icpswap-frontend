import { Typography } from "components/Mui";
import { Flex, MainCard } from "@icpswap/ui";
import { Link } from "components/index";
import { WaringIcon } from "assets/icons/WaringIcon";

export function GuidePanel() {
  return (
    <MainCard level={1} padding="24px" borderRadius="16px">
      <Flex gap="0 8px" fullWidth>
        <WaringIcon />

        <Typography sx={{ lineHeight: "20px" }}>
          If you’re using the limit order feature for the first time, check out
          <Link link="https://iloveics.gitbook.io/icpswap/products/limit-order/how-to-use-limit-order">
            <Typography color="text.theme-secondary">this Guide.</Typography>
          </Link>
        </Typography>
      </Flex>
    </MainCard>
  );
}
