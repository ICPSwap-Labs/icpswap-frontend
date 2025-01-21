import { Connector } from "constants/wallet";
import { NFIDW, Plug, InternetIdentity } from "@nfid/identitykit";

export const IdentityKitConnector = [Connector.NFID];

export const IdentityKitId = {
  [Connector.IC]: InternetIdentity.id,
  [Connector.NFID]: NFIDW.id,
  [Connector.PLUG]: Plug.id,
};
