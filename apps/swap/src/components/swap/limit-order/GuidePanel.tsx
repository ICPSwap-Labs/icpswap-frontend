import { Flex, MainCard } from "@icpswap/ui";
import { WaringIcon } from "assets/icons/WaringIcon";
import { Link } from "components/index";
import { Typography } from "components/Mui";

export function GuidePanel() {
  return (
    <MainCard level={1} padding="24px" borderRadius="16px">
      <Flex gap="0 8px" fullWidth>
        <WaringIcon />

        <Typography sx={{ lineHeight: "20px" }} component="div">
          If you’re using the limit order feature for the first time, check out
          <Link link="https://iloveics.gitbook.io/icpswap/products/limit-order">
            <Typography color="text.theme-secondary">this Guide.</Typography>
          </Link>
        </Typography>
      </Flex>
    </MainCard>
  );
}
