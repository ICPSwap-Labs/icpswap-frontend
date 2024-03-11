import { Grid, Box, Typography, Button } from "@mui/material";
import MainCard from "components/cards/MainCard";
import NoData from "components/no-data";
import { useWalletConnectorManager } from "store/auth/hooks";
import { Trans } from "@lingui/macro";

export default function ConnectWallet() {
  const [, walletManager] = useWalletConnectorManager();

  return (
    <Grid container justifyContent="center">
      <Box sx={{ maxWidth: "1400px", width: "100%" }}>
        <MainCard level={3}>
          <Grid container alignItems="center" flexDirection="column" sx={{ height: "250px" }}>
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
          </Grid>
        </MainCard>
      </Box>
    </Grid>
  );
}
