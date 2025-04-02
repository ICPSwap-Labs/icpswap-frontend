import { useMemo } from "react";
import { ConnectorConfigs } from "constants/wallet";
import { useConnector } from "store/auth/hooks";

import { Image } from "./Image";

export interface ConnectorImageProps {
  size?: string;
}

export function ConnectorImage({ size = "20px" }: ConnectorImageProps) {
  const connector = useConnector();

  const imageUrl = useMemo(() => {
    if (!connector) return null;
    return ConnectorConfigs.find((e) => e.value === connector)?.logo;
  }, [connector]);

  return connector && imageUrl ? <Image sx={{ width: size, height: size }} src={imageUrl} /> : null;
}
