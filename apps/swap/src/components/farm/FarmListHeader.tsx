import { Box, BoxProps } from "components/Mui";
import { Flex } from "components/index";
import { Trans } from "@lingui/macro";
import { HeaderCell } from "@icpswap/ui";

interface FarmListHeaderProps {
  showState: boolean;
  state: "NOT_STARTED" | "LIVE" | "FINISHED" | undefined;
  sx?: BoxProps["sx"];
  your: boolean;
  id?: string;
}

export function FarmListHeader({ id, your, state, showState, sx }: FarmListHeaderProps) {
  return (
    <Box
      id={id}
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
      <HeaderCell className="row-item">
        <Trans>Staked Position</Trans>
      </HeaderCell>
      <HeaderCell className="row-item">
        <Trans>Reward Token</Trans>
      </HeaderCell>
      <Flex justify="flex-end" className="row-item">
        <HeaderCell>
          <Trans>APR</Trans>
        </HeaderCell>
      </Flex>

      {state !== "FINISHED" ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>
            <Trans>Your Available to Stake</Trans>
          </HeaderCell>
        </Flex>
      ) : null}

      {your ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>
            <Trans>Your Rewards</Trans>
          </HeaderCell>
        </Flex>
      ) : null}

      {your || state === "FINISHED" ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>
            <Trans>Your Staked</Trans>
          </HeaderCell>
        </Flex>
      ) : null}

      {!your && state !== "FINISHED" ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>
            <Trans>Total Staked</Trans>
          </HeaderCell>
        </Flex>
      ) : null}

      {state === "FINISHED" ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>
            <Trans>Total Reward Tokens</Trans>
          </HeaderCell>
        </Flex>
      ) : null}

      {showState ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>
            <Trans>Status</Trans>
          </HeaderCell>
        </Flex>
      ) : null}
    </Box>
  );
}
