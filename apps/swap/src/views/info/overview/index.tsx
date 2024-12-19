import { Flex } from "@icpswap/ui";
import { InfoWrapper } from "components/index";

import { Icp } from "./Icp";
import { ICPSwap } from "./icpswap";
import { Ics } from "./ics";

export default function Overview() {
  return (
    <InfoWrapper>
      <Flex fullWidth vertical align="flex-start" gap="20px 0">
        <Ics />

        <Icp />

        <ICPSwap />
      </Flex>
    </InfoWrapper>
  );
}
