import { Box, BoxProps, Typography } from "components/Mui";
import { Flex } from "components/index";
import { Trans } from "@lingui/macro";

interface FarmListHeaderProps {
  showState: boolean;
  state: "NOT_STARTED" | "LIVE" | "FINISHED" | undefined;
  sx?: BoxProps["sx"];
  your: boolean;
}

export function FarmListHeader({ your, state, showState, sx }: FarmListHeaderProps) {
  return (
    <Box
      sx={{
        display: "grid",
        "& .row-item": {
          padding: "16px 0",
          "&:first-of-type": {
            padding: "16px 0 16px 24px",
          },
          "&:last-of-type": {
            padding: "16px 24px 16px 0",
          },
        },
        ...sx,
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

      {state !== "FINISHED" ? (
        <Flex justify="flex-end" className="row-item">
          <Typography variant="body2" color="text.400">
            <Trans>Your Available to Stake</Trans>
          </Typography>
        </Flex>
      ) : null}

      {your ? (
        <Flex justify="flex-end" className="row-item">
          <Typography variant="body2" color="text.400">
            <Trans>Your Rewards</Trans>
          </Typography>
        </Flex>
      ) : null}

      {your ? (
        <Flex justify="flex-end" className="row-item">
          <Typography variant="body2" color="text.400">
            <Trans>Your Staked</Trans>
          </Typography>
        </Flex>
      ) : null}

      {!your && state !== "FINISHED" ? (
        <Flex justify="flex-end" className="row-item">
          <Typography variant="body2" color="text.400">
            <Trans>Total Staked</Trans>
          </Typography>
        </Flex>
      ) : null}

      {state === "FINISHED" ? (
        <Flex justify="flex-end" className="row-item">
          <Typography variant="body2" color="text.400">
            <Trans>Total Reward Tokens</Trans>
          </Typography>
        </Flex>
      ) : null}

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
