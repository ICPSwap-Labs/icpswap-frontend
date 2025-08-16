import { Link } from "@icpswap/ui";
import { Image } from "components/Image/index";

export function ToWallet() {
  return (
    <Link to="/wallet">
      <Image src="/images/wallet.svg" sx={{ width: "30px", height: "30px", cursor: "pointer" }} />
    </Link>
  );
}
