import { Box } from "components/Mui";
import { Flex } from "components/index";
import { Trans } from "@lingui/macro";
import { HeaderCell } from "@icpswap/ui";

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
      <HeaderCell className="row-item">
        <Trans>Staked Token</Trans>
      </HeaderCell>
      <HeaderCell className="row-item">
        <Trans>Reward Token</Trans>
      </HeaderCell>
      <Flex justify="flex-end" className="row-item">
        <HeaderCell>
          <Trans>APR</Trans>
        </HeaderCell>
      </Flex>

      {finished ? null : (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>
            <Trans>Your Available to Stake</Trans>
          </HeaderCell>
        </Flex>
      )}

      {your || finished ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>
            <Trans>Your Staked</Trans>
          </HeaderCell>
        </Flex>
      ) : null}

      {your ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>
            <Trans>Your Rewards</Trans>
          </HeaderCell>
        </Flex>
      ) : finished ? null : (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>
            <Trans>Total Staked</Trans>
          </HeaderCell>
        </Flex>
      )}

      {finished ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>
            <Trans>Total Reward Tokens</Trans>
          </HeaderCell>
        </Flex>
      ) : null}

      {showState ? (
        <Flex justify="flex-end">
          <HeaderCell className="row-item">
            <Trans>Status</Trans>
          </HeaderCell>
        </Flex>
      ) : null}
    </Box>
  );
}
