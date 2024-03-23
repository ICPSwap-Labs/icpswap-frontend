import { TokenImage as UITokenImage } from "@icpswap/ui";
import { useSNSTokenRootId } from "hooks/token/useSNSTokenRootId";
import { SxProps } from "@mui/material";

export interface TokenImageProps {
  logo: string | undefined;
  size?: string;
  tokenId?: string;
  sx?: SxProps;
}

export function TokenImage({ tokenId, logo, sx, size = "28px" }: TokenImageProps) {
  const root_canister_id = useSNSTokenRootId(tokenId);

  return <UITokenImage size={size} logo={logo} sx={sx} sns={!!root_canister_id} />;
}
