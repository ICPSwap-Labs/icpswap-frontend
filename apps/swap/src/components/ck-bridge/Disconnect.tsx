import { Box, Typography } from "components/Mui";
import { useCallback } from "react";
import { useAccount, useChainId, useDisconnect } from "wagmi";

export function DisconnectButton() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const currChainId = useChainId();

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error(`web3-react connection error: ${error}`);
    }
  }, [currChainId]);

  return address ? (
    <Box
      sx={{ padding: "8px", borderRadius: "8px", border: "1px solid #4F5A84", cursor: "pointer" }}
      onClick={handleDisconnect}
    >
      <Typography sx={{ fontSize: "14px" }}>Disconnect</Typography>
    </Box>
  ) : null;
}
