import type { Null } from "@icpswap/types";
import { TokenImage as UITokenImage } from "@icpswap/ui";
import type { BoxProps } from "components/Mui";
import { useSNSTokenRootId } from "hooks/token/useSNSTokenRootId";

export interface TokenImageProps {
  logo: string | undefined;
  size?: string;
  tokenId?: string | Null;
  sx?: BoxProps["sx"];
}

export function TokenImage({ tokenId, logo, sx, size = "28px" }: TokenImageProps) {
  const root_canister_id = useSNSTokenRootId(tokenId);

  return <UITokenImage size={size} logo={logo} sx={sx} sns={!!root_canister_id} />;
}
