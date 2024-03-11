import { Link } from "@mui/material";
import { INFO_URL } from "constants/index";

export default function TokenInfo({ tokenInfo }: { tokenInfo: any }) {
  return (
    <Link href={`${INFO_URL}/token/detail/${tokenInfo?.canisterId}`} target="_blank">
      {tokenInfo?.symbol}
    </Link>
  );
}
