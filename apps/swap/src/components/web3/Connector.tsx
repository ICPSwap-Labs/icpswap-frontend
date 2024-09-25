import { useWeb3React } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { Button } from "@mui/material";
import { injectedConnection } from "utils/web3/connection";
import { DEFAULT_CHAIN_ID } from "constants/web3";
import { useCallback } from "react";
import { isMobile } from "react-device-detect";

export interface Web3ButtonConnectorProps {
  chainId?: number;
}

export function Web3ButtonConnector({ chainId }: Web3ButtonConnectorProps) {
  const { account, chainId: currChainId } = useWeb3React();

  const tryActivation = useCallback(
    async (connector: Connector) => {
      try {
        await connector.activate(chainId ?? DEFAULT_CHAIN_ID);
      } catch (error) {
        console.error(`web3-react connection error: ${error}`);
      }
    },
    [chainId],
  );

  const handleConnect = useCallback(async () => {
    if (isMobile) {
      // if (!account) {
      //   window.open("https://metamask.io/download/");
      // }
      return;
    }

    if (!account || (!!account && currChainId !== (chainId ?? DEFAULT_CHAIN_ID))) {
      tryActivation(injectedConnection.connector);
    }
  }, [isMobile, account, currChainId, chainId, DEFAULT_CHAIN_ID]);

  return (
    <Button sx={{ maxWidth: "100%" }} variant="contained" onClick={handleConnect} disabled={isMobile}>
      {isMobile ? "Not supported on mobile" : "Connect to Metamask"}
    </Button>
  );
}
