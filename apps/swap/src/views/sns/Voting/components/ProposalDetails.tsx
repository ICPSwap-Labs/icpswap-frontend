import { Box, Typography } from "@mui/material";
import { Trans } from "@lingui/macro";
import { useMemo } from "react";
import type { ProposalData } from "@icpswap/types";
import { shorten, nowInSeconds, toHexString } from "@icpswap/utils";
import { useParams } from "react-router-dom";
import { Copy } from "components/Copy/icon";
import dayjs from "dayjs";

import { convertProposalNumberToText, snsRewardStatus, SnsRewordsText } from "../proposal.utils";

interface ProposalDetailItemProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

function ProposalDetailItem({ label, value }: ProposalDetailItemProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography component="div">{label}</Typography>
      <Typography component="div">{value}</Typography>
    </Box>
  );
}

export interface ProposalDetailsProps {
  proposal_data: ProposalData | undefined;
}

export function ProposalDetails({ proposal_data }: ProposalDetailsProps) {
  const { proposal_id } = useParams<{ governance_id: string; proposal_id: string }>();

  const { isExecuted, proposer } = useMemo(() => {
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
    <Box>
      <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "16px" }}>
        <Trans>Proposal Details</Trans>
      </Typography>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px 0" }}>
          <ProposalDetailItem label={<Trans>Proposal ID</Trans>} value={proposal_id} />

          <ProposalDetailItem
            label={<Trans>Type</Trans>}
            value={proposal_data ? convertProposalNumberToText(proposal_data?.action) : "--"}
          />

          <ProposalDetailItem
            label={<Trans>Status</Trans>}
            value={<Typography>{isExecuted ? <Trans>Executed</Trans> : <Trans>Open</Trans>}</Typography>}
          />

          <ProposalDetailItem
            label={<Trans>Reward Status</Trans>}
            value={<Typography>{proposal_data ? SnsRewordsText[snsRewardStatus(proposal_data)] : "--"}</Typography>}
          />

          <ProposalDetailItem
            label={<Trans>Created</Trans>}
            value={
              <Typography>
                {proposal_data?.proposal_creation_timestamp_seconds
                  ? dayjs(Number(proposal_data.proposal_creation_timestamp_seconds * BigInt(1000))).format(
                      "YYYY-MM-DD HH:mm:ss",
                    )
                  : "--"}
              </Typography>
            }
          />

          {isExecuted ? (
            <>
              <ProposalDetailItem
                label={<Trans>Decided</Trans>}
                value={
                  <Typography>
                    {proposal_data?.decided_timestamp_seconds
                      ? dayjs(Number(proposal_data.decided_timestamp_seconds * BigInt(1000))).format(
                          "YYYY-MM-DD HH:mm:ss",
                        )
                      : "--"}
                  </Typography>
                }
              />

              <ProposalDetailItem
                label={<Trans>Executed</Trans>}
                value={
                  <Typography>
                    {proposal_data?.executed_timestamp_seconds
                      ? dayjs(Number(proposal_data.executed_timestamp_seconds * BigInt(1000))).format(
                          "YYYY-MM-DD HH:mm:ss",
                        )
                      : "--"}
                  </Typography>
                }
              />
            </>
          ) : null}

          <ProposalDetailItem
            label={<Trans>Proposer</Trans>}
            value={
              proposer ? (
                <Box sx={{ display: "flex", gap: "0 5px", alignItems: "center" }}>
                  <Typography>{shorten(toHexString(proposer))}</Typography>
                  <Copy content={toHexString(proposer)} />
                </Box>
              ) : (
                "--"
              )
            }
          />
        </Box>
      </Box>
    </Box>
  );
}
