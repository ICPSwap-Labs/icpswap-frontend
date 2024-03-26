import PoolList from "ui-component/staking-farm/PoolList";
import { Wrapper } from "ui-component/index";
import { MainCard } from "@icpswap/ui";

export default function Farms() {
  return (
    <Wrapper>
      <MainCard>
        <PoolList />
      </MainCard>
    </Wrapper>
  );
}
