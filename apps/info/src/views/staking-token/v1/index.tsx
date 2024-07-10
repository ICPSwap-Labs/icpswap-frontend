import PoolList from "ui-component/staking-token/PoolList";
import { Wrapper } from "ui-component/index";
import { MainCard } from "@icpswap/ui";

export default function Pools() {
  return (
    <Wrapper>
      <MainCard>
        <PoolList />
      </MainCard>
    </Wrapper>
  );
}
