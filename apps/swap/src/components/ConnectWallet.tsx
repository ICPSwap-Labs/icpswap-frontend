import { MainCard } from "components/index";
import { useWalletConnectorManager } from "store/auth/hooks";
import { Trans } from "@lingui/macro";
import { Box, Typography, Button } from "components/Mui";
import { Flex, NoData } from "@icpswap/ui";

export default function ConnectWallet() {
  const [, walletManager] = useWalletConnectorManager();

  return (
    <Flex fullWidth justify="center">
      <Box sx={{ maxWidth: "1400px", width: "100%", padding: "48px 0 0 0" }}>
        <MainCard level={3}>
          <Flex fullWidth align="center" vertical sx={{ height: "250px" }}>
            <NoData />
            <Typography color="text.primary">
              <Trans>Connect wallet to view</Trans>
            </Typography>
            <Button
              variant="contained"
              onClick={() => walletManager(true)}
              sx={{ width: "100%", maxWidth: "522px", marginTop: "23px" }}
              size="large"
            >
              <Trans>Connect Wallet</Trans>
            </Button>
          </Flex>
        </MainCard>
      </Box>
    </Flex>
  );
}
