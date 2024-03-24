import { SxProps } from "@mui/material";
import { TokenImage as UITokenImage } from "@icpswap/ui";
import { useSNSTokenRootId } from "hooks/token/useSNSTokenRootId";

interface TokenImageProps {
  logo: string | undefined;
  size?: string;
  sx?: SxProps;
  tokenId?: string;
}

export function TokenImage({ tokenId, logo, size = "20px", sx }: TokenImageProps) {
  const root_canister_id = useSNSTokenRootId(tokenId);

  return <UITokenImage size={size} logo={logo} sx={sx} sns={!!root_canister_id} />;
}
