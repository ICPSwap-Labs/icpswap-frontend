import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { Flex } from "components/index";
import { Trans } from "@lingui/macro";

export function YourFarmListHeader() {
  const theme = useTheme() as Theme;
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: matchDownSM
          ? "180px 180px 80px 220px 160px 160px 160px"
          : "180px 180px 80px 1fr 1fr 1fr 100px",
        "& .row-item": {
          padding: "16px 0",
          "&:first-of-type": {
            padding: "16px 0 16px 24px",
          },
          "&:last-of-type": {
            padding: "16px 24px 16px 0",
          },
        },
      }}
    >
      <Typography variant="body2" color="text.400" className="row-item">
        <Trans>Staked Position</Trans>
      </Typography>
      <Typography variant="body2" color="text.400" className="row-item">
        <Trans>Reward Token</Trans>
      </Typography>
      <Flex justify="flex-end" className="row-item">
        <Typography variant="body2" color="text.400">
          <Trans>APR</Trans>
        </Typography>
      </Flex>
      <Flex justify="flex-end" className="row-item">
        <Typography variant="body2" color="text.400">
          <Trans>Your Available to Stake</Trans>
        </Typography>
      </Flex>
      <Flex justify="flex-end" className="row-item">
        <Typography variant="body2" color="text.400">
          <Trans>Your Rewards</Trans>
        </Typography>
      </Flex>
      <Flex justify="flex-end" className="row-item">
        <Typography variant="body2" color="text.400">
          <Trans>Total Staked</Trans>
        </Typography>
      </Flex>
      <Flex justify="flex-end" className="row-item">
        <Typography variant="body2" color="text.400">
          <Trans>Status</Trans>
        </Typography>
      </Flex>
    </Box>
  );
}
