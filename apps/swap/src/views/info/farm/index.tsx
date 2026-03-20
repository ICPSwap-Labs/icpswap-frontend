import { MainCard } from "@icpswap/ui";
import { InfoWrapper } from "components/index";
import { FarmPools } from "components/info/farm";

export default function Farms() {
  return (
    <InfoWrapper>
      <MainCard>
        <FarmPools />
      </MainCard>
    </InfoWrapper>
  );
}
