import { Connector } from "constants/wallet";
import { useConnectorType } from "store/auth/hooks";

import { Image } from "./Image";

const ConnectorIcon: { [key: string]: string } = {
  [Connector.IC]: "/images/connect/InternetIdentity.svg",
  [Connector.ME]: "/images/connect/AstroX.svg",
  [Connector.ICPSwap]: "/images/connect/icpswap.svg",
  [Connector.INFINITY]: "/images/connect/Infinity.svg",
  [Connector.Metamask]: "/images/connect/metamask.svg",
  [Connector.NFID]: "/images/connect/NFID.svg",
  [Connector.PLUG]: "/images/connect/Plug.svg",
  [Connector.STOIC]: "/images/connect/stoic.svg",
};

export interface AddressSectionProps {
  size?: string;
}

export function ConnectorImage({ size = "20px" }: AddressSectionProps) {
  const connector = useConnectorType();

  return connector ? <Image sx={{ width: size, height: size }} src={ConnectorIcon[connector]} /> : null;
}
