import { Button } from "components/Mui";
import { DEFAULT_CHAIN_ID } from "constants/web3";
import { useCallback } from "react";
import { isMobile } from "react-device-detect";
import { useConnect, useChainId } from "wagmi";
import { injected } from "wagmi/connectors";

export interface Web3ButtonConnectorProps {
  chainId?: number;
}

export function Web3ButtonConnector() {
  const { connect } = useConnect();
  const currChainId = useChainId();

  const handleConnect = useCallback(async () => {
    if (isMobile) return;

    try {
      await connect({ connector: injected() });
    } catch (error) {
      console.error(`web3-react connection error: ${error}`);
    }
  }, [isMobile, currChainId, DEFAULT_CHAIN_ID]);

  return (
    <Button sx={{ maxWidth: "100%" }} variant="contained" onClick={handleConnect} disabled={isMobile}>
      {isMobile ? "Not supported on mobile" : "Connect to MetaMask"}
    </Button>
  );
}
