import { StakePools } from "components/info/stake";
import { InfoWrapper } from "components/index";
import { MainCard } from "@icpswap/ui";

export default function Pools() {
  return (
    <InfoWrapper>
      <MainCard>
        <StakePools />
      </MainCard>
    </InfoWrapper>
  );
}
