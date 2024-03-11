import { Connector } from "@web3-react/types";
import { ConnectionType, injectedConnection } from "./index";

const CONNECTIONS = [injectedConnection];

export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = CONNECTIONS.find((connection) => connection.connector === c);
    if (!connection) {
      throw Error("unsupported connector");
    }
    return connection;
  } else {
    return injectedConnection;
  }
}
