import { Box, Typography } from "@mui/material";
import { Flex } from "components/index";
import { Trans } from "@lingui/macro";

export interface PoolListHeaderProps {
  showState: boolean;
  gridTemplateColumns: string;
}

export function PoolListHeader({ showState, gridTemplateColumns }: PoolListHeaderProps) {
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
        <Trans>Staked Token</Trans>
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
        <Flex justify="flex-end">
          <Typography variant="body2" color="text.400" className="row-item">
            <Trans>Status</Trans>
          </Typography>
        </Flex>
      ) : null}
    </Box>
  );
}

export interface YourPoolListHeaderProps {
  showState: boolean;
  gridTemplateColumns: string;
}

export function YourPoolListHeader({ showState, gridTemplateColumns }: YourPoolListHeaderProps) {
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
        <Trans>Staked Token</Trans>
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
          <Trans>Your Staked</Trans>
        </Typography>
      </Flex>
      <Flex justify="flex-end" className="row-item">
        <Typography variant="body2" color="text.400">
          <Trans>Your Rewards</Trans>
        </Typography>
      </Flex>
      {showState ? (
        <Flex justify="flex-end">
          <Typography variant="body2" color="text.400" className="row-item">
            <Trans>Status</Trans>
          </Typography>
        </Flex>
      ) : null}
    </Box>
  );
}
