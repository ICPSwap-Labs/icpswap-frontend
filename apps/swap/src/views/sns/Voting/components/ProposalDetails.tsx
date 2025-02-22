import { Box, Typography } from "components/Mui";
import { useMemo } from "react";
import type { ProposalData } from "@icpswap/types";
import { shorten, nowInSeconds, toHexString } from "@icpswap/utils";
import { useParams } from "react-router-dom";
import { Copy } from "components/Copy/icon";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        {t("nns.proposal.details")}
      </Typography>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px 0" }}>
          <ProposalDetailItem label={t("nns.proposal.id")} value={proposal_id} />

          <ProposalDetailItem
            label={t("common.type")}
            value={proposal_data ? convertProposalNumberToText(proposal_data?.action) : "--"}
          />

          <ProposalDetailItem
            label={t("common.status")}
            value={<Typography>{isExecuted ? t("common.executed") : t("common.open")}</Typography>}
          />

          <ProposalDetailItem
            label={t("nns.voting.reward.status")}
            value={<Typography>{proposal_data ? SnsRewordsText[snsRewardStatus(proposal_data)] : "--"}</Typography>}
          />

          <ProposalDetailItem
            label={t("common.created")}
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
                label={t("common.decided")}
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
                label={t("common.executed")}
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
            label={t("nns.voting.proposer")}
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
