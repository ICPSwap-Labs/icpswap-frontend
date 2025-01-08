import { Box, Typography } from "@mui/material";
import { Flex } from "components/index";
import { Trans } from "@lingui/macro";

export interface PoolListHeaderProps {
  showState: boolean;
  gridTemplateColumns: string;
  your: boolean;
  finished: boolean;
  id?: string;
}

export function PoolListHeader({ id, showState, finished, gridTemplateColumns, your }: PoolListHeaderProps) {
  return (
    <Box
      id={id}
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
      <Typography color="text.400" className="row-item">
        <Trans>Staked Token</Trans>
      </Typography>
      <Typography color="text.400" className="row-item">
        <Trans>Reward Token</Trans>
      </Typography>
      <Flex justify="flex-end" className="row-item">
        <Typography color="text.400">
          <Trans>APR</Trans>
        </Typography>
      </Flex>

      {finished ? null : (
        <Flex justify="flex-end" className="row-item">
          <Typography color="text.400">
            <Trans>Your Available to Stake</Trans>
          </Typography>
        </Flex>
      )}

      {your || finished ? (
        <Flex justify="flex-end" className="row-item">
          <Typography color="text.400">
            <Trans>Your Staked</Trans>
          </Typography>
        </Flex>
      ) : null}

      {your ? (
        <Flex justify="flex-end" className="row-item">
          <Typography color="text.400">
            <Trans>Your Rewards</Trans>
          </Typography>
        </Flex>
      ) : finished ? null : (
        <Flex justify="flex-end" className="row-item">
          <Typography color="text.400">
            <Trans>Total Staked</Trans>
          </Typography>
        </Flex>
      )}

      {finished ? (
        <Flex justify="flex-end" className="row-item">
          <Typography color="text.400">
            <Trans>Total Reward Tokens</Trans>
          </Typography>
        </Flex>
      ) : null}

      {showState ? (
        <Flex justify="flex-end">
          <Typography color="text.400" className="row-item">
            <Trans>Status</Trans>
          </Typography>
        </Flex>
      ) : null}
    </Box>
  );
}
