import { useGraphTokenPoolsDetails } from "hooks/v2";
import Pools from "./Pools";

export interface TokenPoolsProps {
  canisterId: string;
}

export default function TokenPools({ canisterId }: TokenPoolsProps) {
  const { result: pools, loading } = useGraphTokenPoolsDetails(canisterId);

  return <Pools pools={pools} loading={loading} />;
}
