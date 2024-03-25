import { useMemo } from "react";
import { Typography, Box } from "@mui/material";
import { t } from "@lingui/macro";
import { ProposalInfo } from "@icpswap/types";
import { useCounter } from "hooks/useTimeCounter";
import { ProposalLabel, ProposalState } from "constants/vote";
import { nanosecond2Millisecond } from "@icpswap/utils";

export function VoteClosedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.98281 1.625C4.45937 1.625 1.60156 4.48125 1.60156 8.00625C1.60156 11.5297 4.45781 14.3875 7.98281 14.3875C11.5062 14.3875 14.3641 11.5312 14.3641 8.00625C14.3641 4.48281 11.5078 1.625 7.98281 1.625ZM11.5734 6.48281L7.80937 10.2469C7.70937 10.3469 7.57969 10.3953 7.45 10.3953C7.32031 10.3953 7.18906 10.3469 7.09062 10.2469L4.94219 8.1C4.74375 7.90156 4.74375 7.58125 4.94219 7.38281C5.14062 7.18437 5.46094 7.18437 5.65937 7.38281L7.44844 9.17187L10.8547 5.76562C11.0531 5.56719 11.3734 5.56719 11.5719 5.76562C11.7719 5.96406 11.7719 6.28594 11.5734 6.48281Z"
        fill="#54C081"
      />
    </svg>
  );
}

export function StateLabel({ state }: { state: ProposalState | undefined }) {
  return (
    <Box
      sx={{
        width: "64px",
        height: "26px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px",
        background:
          state === ProposalState.ACTIVE
            ? "linear-gradient(89.44deg, #5569DB -0.31%, #8572FF 91.14%)"
            : state === ProposalState.CLOSED
            ? "#565F80"
            : "#54C081",
      }}
    >
      {state ? (
        <Typography color="text.primary" component="span" fontSize="12px">
          {ProposalLabel[state]}
        </Typography>
      ) : null}
    </Box>
  );
}

export function useVoteState(proposal: ProposalInfo | undefined | null): ProposalState | undefined {
  const isPending = proposal?.beginTime
    ? nanosecond2Millisecond(proposal?.beginTime) > new Date().getTime()
    : undefined;

  const count = useCounter(
    isPending !== undefined
      ? isPending
        ? proposal?.beginTime
          ? nanosecond2Millisecond(proposal?.beginTime)
          : undefined
        : proposal?.endTime
        ? nanosecond2Millisecond(proposal?.endTime)
        : undefined
      : undefined,
  );

  return useMemo(() => {
    if (!proposal) return undefined;

    const now = new Date().getTime();

    if (nanosecond2Millisecond(proposal.endTime) < now) {
      return ProposalState.CLOSED;
    }

    if (nanosecond2Millisecond(proposal.endTime) > now && nanosecond2Millisecond(proposal.beginTime) < now) {
      return ProposalState.ACTIVE;
    }

    return ProposalState.PENDING;
  }, [proposal, count]);
}

export interface VoteItemProps {
  proposal: ProposalInfo | undefined | null;
}

export function VoteStateCount({ proposal }: VoteItemProps) {
  const isPending = proposal?.beginTime
    ? nanosecond2Millisecond(proposal?.beginTime) > new Date().getTime()
    : undefined;

  const count = useCounter(
    isPending !== undefined
      ? isPending
        ? proposal?.beginTime
          ? nanosecond2Millisecond(proposal?.beginTime)
          : undefined
        : proposal?.endTime
        ? nanosecond2Millisecond(proposal?.endTime)
        : undefined
      : undefined,
  );

  const proposalState = useVoteState(proposal);

  const total = useMemo(() => {
    if (!proposal) return BigInt(0);

    return proposal.options.reduce(
      (prevValue, currentValue) => {
        return { k: "", v: currentValue.v + prevValue.v };
      },
      { k: "initialValue", v: BigInt(0) },
    ).v;
  }, [proposal]);

  return count ? (
    <Box
      component="span"
      sx={{
        border: proposalState === ProposalState.CLOSED ? "1px solid #54C081" : "1px solid #5569DB",
        padding: "4px 10px",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        width: "fit-content",
      }}
    >
      {proposalState === ProposalState.CLOSED ? <VoteClosedIcon /> : null}
      <Typography
        fontSize="12px"
        component="span"
        sx={{
          marginLeft: proposalState === ProposalState.CLOSED ? "5px" : 0,
        }}
      >
        {proposalState === ProposalState.ACTIVE
          ? t`${count?.hour}:${count?.min}:${count?.sec} left`
          : proposalState === ProposalState.PENDING
          ? t`start in ${count?.hour}:${count?.min}:${count?.sec}`
          : t`${String(total)} Votes`}
      </Typography>
    </Box>
  ) : null;
}
