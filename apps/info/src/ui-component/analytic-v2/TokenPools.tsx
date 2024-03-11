import Pools from "./Pools";
import { useGraphTokenPoolsDetails } from "hooks/v2";

export interface TokenPoolsProps {
  canisterId: string;
}

export default function TokenPools({ canisterId }: TokenPoolsProps) {
  const { result: pools, loading } = useGraphTokenPoolsDetails(canisterId);

  return <Pools pools={pools} loading={loading} />;
}
