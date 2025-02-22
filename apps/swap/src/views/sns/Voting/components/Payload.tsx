import { Box, Typography } from "components/Mui";
import { useMemo } from "react";
import { MainCard } from "components/index";
import type { ProposalData } from "@icpswap/types";
import { nowInSeconds } from "@icpswap/utils";
import BaseMarkdown from "components/markdown/BaseMarkdown";
import { useTranslation } from "react-i18next";

export interface ProposalPayloadProps {
  proposal_data: ProposalData | undefined;
}

export function ProposalPayload({ proposal_data }: ProposalPayloadProps) {
  const { t } = useTranslation();

  const { payload_text_rendering } = useMemo(() => {
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
      payload_text_rendering: proposal_data.payload_text_rendering[0],
    };
  }, [proposal_data]);

  return (
    <MainCard level={4} sx={{ margin: "20px 0 0 0" }}>
      <Box>
        <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "16px" }}>{t("common.payload")}</Typography>

        {payload_text_rendering ? (
          <MainCard level={3} sx={{ margin: "20px 0 0 0" }}>
            <BaseMarkdown content={payload_text_rendering} />
          </MainCard>
        ) : null}
      </Box>
    </MainCard>
  );
}
