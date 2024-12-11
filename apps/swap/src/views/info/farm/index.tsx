import { FarmPools } from "components/info/farm";
import { InfoWrapper } from "components/index";
import { MainCard } from "@icpswap/ui";

export default function Farms() {
  return (
    <InfoWrapper>
      <MainCard>
        <FarmPools />
      </MainCard>
    </InfoWrapper>
  );
}
