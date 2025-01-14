import { Box, Typography, Button } from "components/Mui";
import { MainCard, Wrapper } from "components/index";
import { NoData, Flex } from "@icpswap/ui";
import { useConnectManager } from "store/auth/hooks";
import { Trans } from "@lingui/macro";

export default function ConnectWallet() {
  const { showConnector } = useConnectManager();

  return (
    <Wrapper>
      <Flex fullWidth align="flex-start" justify="center">
        <Box sx={{ maxWidth: "1400px", width: "100%" }}>
          <MainCard level={3}>
            <Flex fullWidth vertical sx={{ height: "250px" }}>
              <NoData />
              <Typography color="text.primary">
                <Trans>Connect wallet to view</Trans>
              </Typography>
              <Button
                variant="contained"
                onClick={() => showConnector(true)}
                sx={{ width: "100%", maxWidth: "522px", marginTop: "23px" }}
                size="large"
              >
                <Trans>Connect Wallet</Trans>
              </Button>
            </Flex>
          </MainCard>
        </Box>
      </Flex>
    </Wrapper>
  );
}
