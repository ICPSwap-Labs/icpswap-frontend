import { Box, Typography, useTheme } from "@mui/material";
import { useListDeployedSNSs, useProposal, useListNeurons, useNervousSystemParameters } from "@icpswap/hooks";
import { useMemo, useState } from "react";
import { LoadingRow, TokenImage, MainCard } from "components/index";
import { Theme } from "@mui/material/styles";
import { useAccountPrincipalString } from "store/auth/hooks";
import { nowInSeconds } from "@icpswap/utils";
import { useTokenInfo } from "hooks/token";
import { useHistory, useParams } from "react-router-dom";
import { ArrowLeft } from "react-feather";

import { ProposalDetails } from "./components/ProposalDetails";
import { VotingResult } from "./components/VotingResult";
import { ProposalSummary } from "./components/Summary";
import { ProposalPayload } from "./components/Payload";

export default function Voting() {
  const theme = useTheme() as Theme;
  const history = useHistory();
  const principal = useAccountPrincipalString();
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

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
  const { result: proposal_data, loading } = useProposal(
    governance_id,
    proposal_id ? BigInt(proposal_id) : undefined,
    refreshTrigger,
  );

  const { result: listNeurons } = useListNeurons({
    canisterId: governance_id,
    limit: 100,
    of_principal: principal,
    refresh: refreshTrigger,
  });

  const { result: neuronSystemParameters } = useNervousSystemParameters(governance_id);

  const { title, isExecuted } = useMemo(() => {
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

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: "1400px" }}>
        <MainCard>
          <Box sx={{ margin: "0 0 12px 0" }}>
            <ArrowLeft color="#ffffff" size="20px" cursor="pointer" onClick={handleBack} />
          </Box>

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
              <Box sx={{ width: "100%" }}>
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

                    <VotingResult
                      proposal_id={proposal_id}
                      governance_id={governance_id}
                      proposal_data={proposal_data}
                      neurons={listNeurons}
                      neuronSystemParameters={neuronSystemParameters}
                      onRefresh={() => setRefreshTrigger(refreshTrigger + 1)}
                    />
                  </Box>
                </MainCard>

                <ProposalSummary proposal_data={proposal_data} />

                <ProposalPayload proposal_data={proposal_data} />
              </Box>
            )}
          </Box>
        </MainCard>
      </Box>
    </Box>
  );
}
