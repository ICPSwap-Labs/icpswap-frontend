import { Button } from "components/Mui";
import { useIsMobile } from "hooks/theme/useIsMobile";
import { useCallback } from "react";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export interface Web3ButtonConnectorProps {
  chainId?: number;
}

export function Web3ButtonConnector() {
  const { connect } = useConnect();
  const isMobile = useIsMobile();

  const handleConnect = useCallback(async () => {
    if (isMobile) return;

    try {
      await connect({ connector: injected() });
    } catch (error) {
      console.error(`web3-react connection error: ${error}`);
    }
  }, [connect, isMobile]);

  return (
    <Button sx={{ maxWidth: "100%" }} variant="contained" onClick={handleConnect} disabled={isMobile}>
      {isMobile ? "Not supported on mobile" : "Connect to MetaMask"}
    </Button>
  );
}
