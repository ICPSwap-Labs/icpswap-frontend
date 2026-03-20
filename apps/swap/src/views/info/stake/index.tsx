import { MainCard } from "@icpswap/ui";
import { InfoWrapper } from "components/index";
import { StakePools } from "components/info/stake";

export default function Pools() {
  return (
    <InfoWrapper>
      <MainCard>
        <StakePools />
      </MainCard>
    </InfoWrapper>
  );
}
