import { Link } from "components/Mui";
import { INFO_URL } from "constants/index";

export default function TokenInfo({ tokenInfo }: { tokenInfo: any }) {
  return (
    <Link href={`${INFO_URL}/info-tokens/details/${tokenInfo?.canisterId}`} target="_blank">
      {tokenInfo?.symbol}
    </Link>
  );
}
