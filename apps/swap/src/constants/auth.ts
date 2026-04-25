import { InternetIdentity, NFIDW, Plug } from "@nfid/identitykit";
import { Connector } from "constants/wallet";

export const IdentityKitConnector = [Connector.NFID];

export const IdentityKitId = {
  [Connector.IC]: InternetIdentity.id,
  [Connector.NFID]: NFIDW.id,
  [Connector.PLUG]: Plug.id,
};
