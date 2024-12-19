import { Image, Tooltip } from "@icpswap/ui";
import { Box } from "components/Mui";
import { ReactNode } from "react";

export interface IsSneedOwnerProps {
  isSneed: boolean;
  tooltip?: ReactNode;
  size?: string;
}

export function IsSneedOwner({ isSneed, tooltip, size = "18px" }: IsSneedOwnerProps) {
  return isSneed ? (
    tooltip ? (
      <Tooltip tips={tooltip}>
        <Box>
          <Image src="/images/sneed.svg" alt="" style={{ width: size, height: size }} />
        </Box>
      </Tooltip>
    ) : (
      <Image src="/images/sneed.svg" alt="" style={{ width: size, height: size }} />
    )
  ) : null;
}
