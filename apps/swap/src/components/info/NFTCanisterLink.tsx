import { Link } from "components/Mui";
import { INFO_URL } from "constants/index";

export default function TokenInfo({ canisterId }: { canisterId: string | undefined }) {
  return canisterId ? (
    <Link href={`${INFO_URL}/info-nfts/canister/details/${canisterId}`} target="_blank">
      {canisterId}
    </Link>
  ) : null;
}
