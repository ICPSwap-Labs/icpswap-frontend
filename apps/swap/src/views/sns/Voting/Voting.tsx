import { Box, Button, Typography, useTheme } from "@mui/material";
import { useListDeployedSNSs, useProposal } from "@icpswap/hooks";
import { Trans, t } from "@lingui/macro";
import { useMemo, useState } from "react";
import { LoadingRow, TabPanel, TokenImage, MainCard } from "components/index";
import type { Neuron, NervousSystemParameters } from "@icpswap/types";
import { Theme } from "@mui/material/styles";
import { SelectSns } from "components/sns/SelectSNSTokens";
import { useAccountPrincipalString } from "store/auth/hooks";
import { neuronFormat, NeuronState, getDissolvingTimeInSeconds, getNervousVotingPower } from "utils/neuron";
import { parseTokenAmount, shorten, toSignificantWithGroupSeparator, nowInSeconds, toHexString } from "@icpswap/utils";
import { Lock, Unlock, Clock } from "react-feather";
import { useTokenInfo } from "hooks/token";
import { secondsToDuration } from "@dfinity/utils";
import { useParams } from "react-router-dom";
import { Copy } from "components/Copy/icon";
import dayjs from "dayjs";

import { ProposalDetails } from "./components/ProposalDetails";
import { VotingResult } from "./components/VotingResult";
import { convertProposalNumberToText, snsRewardStatus, SnsRewordsText } from "./proposal.utils";

export default function Voting() {
  const theme = useTheme() as Theme;
  const principal = useAccountPrincipalString();

  const { governance_id, proposal_id } = useParams<{ governance_id: string; proposal_id: string }>();

  const { result: listedSNS } = useListDeployedSNSs();

  const sns = useMemo(() => {
    if (!governance_id || !listedSNS) return undefined;
    const instance = listedSNS.instances.find((e) => e.governance_canister_id.toString() === governance_id);
    if (!instance) return undefined;
    return instance;
  }, [listedSNS, governance_id]);

  const ledger_id = sns?.ledger_canister_id.toString();
  const { result: tokenInfo } = useTokenInfo(ledger_id);
  const { result: proposal_data, loading } = useProposal(governance_id, proposal_id ? BigInt(proposal_id) : undefined);

  console.log("proposal_data:", proposal_data);

  const { title, summary, seconds, isExecuted, proposer } = useMemo(() => {
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
    <MainCard>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {loading ? (
          <Box sx={{ width: "100%" }}>
            <LoadingRow>
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </LoadingRow>
          </Box>
        ) : (
          <Box sx={{ maxWidth: "1400px", width: "100%" }}>
            <Box sx={{ display: "flex", gap: "0 8px", alignItems: "center" }}>
              <TokenImage logo={tokenInfo?.logo} size="24px" tokenId={ledger_id} />
              <Typography fontSize="16px" fontWeight={500} color="text.primary">
                {title}
              </Typography>
              <Box
                sx={{
                  padding: "3px 10px",
                  borderRadius: "12px",
                  background: !isExecuted ? theme.colors.successDark : theme.palette.background.level1,
                }}
              >
                <Typography color="text.primary">{isExecuted ? "Executed" : "Open"}</Typography>
              </Box>
            </Box>

            <MainCard level={4} sx={{ margin: "20px 0 0 0" }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0 20px",
                  "@media(max-width: 980px)": {
                    gridTemplateColumns: "1fr",
                    gap: "40px 0",
                  },
                }}
              >
                <ProposalDetails proposal_data={proposal_data} />

                <VotingResult proposal_data={proposal_data} />
              </Box>
            </MainCard>
          </Box>
        )}
      </Box>
    </MainCard>
  );
}
