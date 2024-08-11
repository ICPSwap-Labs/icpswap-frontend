import { useMemo } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { Flex } from "components/index";
import { Trans } from "@lingui/macro";

interface FarmListHeaderProps {
  state: "NOT_STARTED" | "LIVE" | "FINISHED" | undefined;
}

export function FarmListHeader({ state }: FarmListHeaderProps) {
  const theme = useTheme() as Theme;
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const { showState, gridTemplateColumns } = useMemo(() => {
    return {
      showState: state === undefined,
      gridTemplateColumns: matchDownSM
        ? state === undefined
          ? "220px 220px 100px 240px 180px 180px"
          : "220px 220px 100px 240px 180px"
        : state === undefined
        ? "220px 220px 120px 1fr 1fr 180px"
        : "220px 220px 120px 1fr 1fr",
    };
  }, [state, matchDownSM]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns,
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
          <Trans>Total Staked</Trans>
        </Typography>
      </Flex>
      {showState ? (
        <Flex justify="flex-end" className="row-item">
          <Typography variant="body2" color="text.400">
            <Trans>Status</Trans>
          </Typography>
        </Flex>
      ) : null}
    </Box>
  );
}
