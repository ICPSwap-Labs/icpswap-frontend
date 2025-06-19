import { Box, Typography, useTheme } from "components/Mui";
import {
  useListDeployedSNSs,
  useProposal,
  useListNeurons,
  useNervousSystemParameters,
  useParsedQueryString,
} from "@icpswap/hooks";
import { useCallback, useMemo, useState } from "react";
import { LoadingRow, TokenImage, MainCard, Wrapper, Flex } from "components/index";
import { useAccountPrincipalString } from "store/auth/hooks";
import { nowInSeconds } from "@icpswap/utils";
import { useToken } from "hooks/index";
import { useHistory, useParams } from "react-router-dom";
import { ArrowLeft } from "react-feather";

import { ProposalDetails } from "./components/ProposalDetails";
import { VotingResult } from "./components/VotingResult";
import { ProposalSummary } from "./components/Summary";
import { ProposalPayload } from "./components/Payload";

interface ProposalSwitchProps {
  proposal_id: string;
  governance_id: string;
  latest_id: string | undefined;
  prev?: boolean;
}

function ProposalSwitch({ proposal_id, latest_id, governance_id, prev }: ProposalSwitchProps) {
  const history = useHistory();

  const handleProposalSwitch = useCallback(() => {
    if (prev) {
      history.push(`/sns/voting/${governance_id}/${Number(proposal_id) - 1}?latest_id=${latest_id}`);
    } else {
      history.push(`/sns/voting/${governance_id}/${Number(proposal_id) + 1}?latest_id=${latest_id}`);
    }
  }, [history, prev, proposal_id, governance_id]);

  return (
    <Box
      sx={{ width: "20px", height: "20px", cursor: "pointer", transform: prev ? "rotate(180deg)" : "rotate(0deg)" }}
      onClick={handleProposalSwitch}
    >
      <img width="20px" height="20px" src="/images/arrow-left.svg" alt="" />
    </Box>
  );
}

export default function Voting() {
  const theme = useTheme();
  const history = useHistory();
  const principal = useAccountPrincipalString();
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const { governance_id, proposal_id } = useParams<{ governance_id: string; proposal_id: string }>();
  const { latest_id } = useParsedQueryString() as { latest_id: string | undefined };

  const { result: listedSNS } = useListDeployedSNSs();

  const sns = useMemo(() => {
    if (!governance_id || !listedSNS) return undefined;
    const instance = listedSNS.instances.find((e) => e.governance_canister_id.toString() === governance_id);
    if (!instance) return undefined;
    return instance;
  }, [listedSNS, governance_id]);

  const ledger_id = sns?.ledger_canister_id.toString();
  const root_id = sns?.root_canister_id[0]?.toString();

  const [, token] = useToken(ledger_id);
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

  const handleBack = useCallback(() => {
    if (root_id) {
      history.push(`/sns/voting?root_id=${root_id}`);
    }
  }, [history, root_id]);

  return (
    <Wrapper>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: "1400px" }}>
          <MainCard>
            <Flex justify="space-between">
              <ArrowLeft color="#ffffff" size="20px" cursor="pointer" onClick={handleBack} />
              <Flex gap="16px">
                {latest_id && latest_id !== proposal_id ? (
                  <ProposalSwitch proposal_id={proposal_id} governance_id={governance_id} latest_id={latest_id} />
                ) : null}

                {proposal_id !== "1" ? (
                  <ProposalSwitch proposal_id={proposal_id} governance_id={governance_id} latest_id={latest_id} prev />
                ) : null}
              </Flex>
            </Flex>

            <Box sx={{ display: "flex", justifyContent: "center", margin: "12px 0 0 0 " }}>
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
                    <TokenImage logo={token?.logo} size="24px" tokenId={ledger_id} />
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
    </Wrapper>
  );
}
