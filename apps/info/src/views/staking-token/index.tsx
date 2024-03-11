import PoolList from "ui-component/staking-token/PoolList";
import { Wrapper, MainCard } from "ui-component/index";

export default function Pools() {
  return (
    <Wrapper>
      <MainCard>
        <PoolList />
      </MainCard>
    </Wrapper>
  );
}
