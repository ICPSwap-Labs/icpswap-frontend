import { Box, Typography } from "@mui/material";
import { Trans } from "@lingui/macro";
import { useMemo } from "react";
import { MainCard } from "components/index";
import type { ProposalData } from "@icpswap/types";
import { nowInSeconds } from "@icpswap/utils";

export interface ProposalSummaryProps {
  proposal_data: ProposalData | undefined;
}

export function ProposalSummary({ proposal_data }: ProposalSummaryProps) {
  const { title, summary } = useMemo(() => {
    if (!proposal_data) return {};

    const __proposal = proposal_data.proposal[0];

    if (!__proposal) return {};

    const deadline = proposal_data.wait_for_quiet_state[0]?.current_deadline_timestamp_seconds;

    return {
      url: __proposal.url,
      title: __proposal.title,
      action: __proposal.action,
      summary: __proposal.summary,
      seconds: deadline ? deadline - BigInt(nowInSeconds()) : undefined,
      isExecuted: proposal_data.executed_timestamp_seconds > 0,
      proposer: proposal_data.proposer[0]?.id,
    };
  }, [proposal_data]);

  return (
    <MainCard level={4} sx={{ margin: "20px 0 0 0" }}>
      <Box>
        <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "16px" }}>
          <Trans>Proposal Summary</Trans>
        </Typography>

        <Typography sx={{ margin: "20px 0 0 0" }}>{title}</Typography>

        <MainCard sx={{ margin: "20px 0 0 0" }} level={3}>
          <Typography>{summary}</Typography>
        </MainCard>
      </Box>
    </MainCard>
  );
}
