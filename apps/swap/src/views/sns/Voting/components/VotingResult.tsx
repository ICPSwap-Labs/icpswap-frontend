import { useMemo, useState } from "react";
import type { Neuron, ProposalData, NervousSystemParameters } from "@icpswap/types";
import { nowInSeconds, formatPercentage, BigNumber, shorten, toHexString } from "@icpswap/utils";
import { CollapseText } from "components/index";
import { Collapse, Typography, Button, Box, useTheme, Theme } from "components/Mui";
import { secondsToDuration } from "@dfinity/utils";
import {
  filterIneligibleNeurons,
  filterVotableNeurons,
  filterVotedNeurons,
  neuronFormat,
  secondsToDissolveDelayDuration,
} from "utils/sns/index";
import { ChevronDown } from "react-feather";
import { useTranslation } from "react-i18next";
import { snsRewardStatus, SnsProposalRewardStatus } from "../proposal.utils";

import { VotableNeurons } from "./VotableNeurons";
import { VoteConfirm } from "./VoteConfirm";
import { Progressbar } from "./Progressbar";
import { VotedNeurons } from "./VotedNeurons";

export interface ProposalDetailsProps {
  proposal_data: ProposalData | undefined;
  neurons: Neuron[] | undefined;
  neuronSystemParameters: NervousSystemParameters | undefined;
  proposal_id: string;
  governance_id: string;
  onRefresh?: () => void;
}

export function VotingResult({
  proposal_id,
  governance_id,
  proposal_data,
  neurons,
  neuronSystemParameters,
  onRefresh,
}: ProposalDetailsProps) {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const [checkedNeuronIds, setCheckedNeuronIds] = useState<string[]>([]);
  const [ineligibleOpen, setIneligibleOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [adopt, setAdopt] = useState(false);
  const [votingPowers, setVotingPowers] = useState<bigint>(BigInt(0));

  const ineligibleNeurons = useMemo(() => {
    if (!neurons || !proposal_data) return undefined;
    return filterIneligibleNeurons({ neurons, proposal: proposal_data });
  }, [neurons, proposal_data]);

  const voteableNeurons = useMemo(() => {
    if (!neurons || !proposal_data) return undefined;
    return filterVotableNeurons({ neurons, proposal: proposal_data });
  }, [neurons, proposal_data]);

  const votedNeurons = useMemo(() => {
    if (!neurons || !proposal_data) return undefined;
    return filterVotedNeurons({ neurons, proposal: proposal_data });
  }, [neurons, proposal_data]);

  const {
    castVotesNo,
    castVotesYes,
    yesProportion,
    noProportion,
    yes,
    no,
    immediateMajorityPercent,
    standardMajorityPercent,
    seconds,
    isExecuted,
  } = useMemo(() => {
    if (!proposal_data) return {};

    const __proposal = proposal_data.proposal[0];

    if (!__proposal) return {};

    const deadline = proposal_data.wait_for_quiet_state[0]?.current_deadline_timestamp_seconds;

    const yes = Number(proposal_data.latest_tally[0]?.yes ?? 0) / 10 ** 8;
    const no = Number(proposal_data.latest_tally[0]?.no ?? 0) / 10 ** 8;
    const total = Number(proposal_data.latest_tally[0]?.total ?? 0) / 10 ** 8;

    const yesNoSum = yes + no;
    const castVotesYes = yesNoSum > 0 ? yes / yesNoSum : 0;
    const castVotesNo = yesNoSum > 0 ? no / yesNoSum : 0;

    const minimum_yes_proportion_of_exercised = proposal_data.minimum_yes_proportion_of_exercised[0]?.basis_points[0];
    const minimum_yes_proportion_of_total = proposal_data.minimum_yes_proportion_of_total[0]?.basis_points[0];

    return {
      url: __proposal.url,
      title: __proposal.title,
      action: __proposal.action,
      summary: __proposal.summary,
      seconds: deadline ? deadline - BigInt(nowInSeconds()) : undefined,
      isExecuted: proposal_data.executed_timestamp_seconds > 0,
      proposer: proposal_data.proposer[0]?.id,
      yes,
      no,
      total,
      yesProportion: total && yes ? yes / total : 0,
      noProportion: total && no ? no / total : 0,
      castVotesYes,
      castVotesNo,
      immediateMajorityPercent: minimum_yes_proportion_of_exercised
        ? Number(minimum_yes_proportion_of_exercised) / 100
        : undefined,
      standardMajorityPercent: minimum_yes_proportion_of_total
        ? Number(minimum_yes_proportion_of_total) / 100
        : undefined,
    };
  }, [proposal_data]);

  const YesColor = theme.colors.successDark;
  const NoColor = theme.colors.danger;

  const { minimumDissolveDelaySeconds } = useMemo(() => {
    if (!neuronSystemParameters) return {};

    return {
      minimumDissolveDelaySeconds: neuronSystemParameters.neuron_minimum_dissolve_delay_to_vote_seconds[0],
    };
  }, [neuronSystemParameters]);

  const handleCheckedNeuronIdsChange = (checkedNeuronIds: string[], votingPowers: bigint) => {
    setCheckedNeuronIds(checkedNeuronIds);
    setVotingPowers(votingPowers);
  };

  const handleAdopt = () => {
    setConfirmOpen(true);
    setAdopt(true);
  };

  const handleReject = () => {
    setConfirmOpen(true);
    setAdopt(false);
  };

  const voteNeurons = useMemo(() => {
    if (!voteableNeurons) return undefined;

    return voteableNeurons.filter((neuron) => {
      const formattedNeuron = neuronFormat(neuron);
      if (formattedNeuron.id === undefined) return false;
      return checkedNeuronIds.includes(formattedNeuron.id);
    });
  }, [voteableNeurons, checkedNeuronIds]);

  const canVote = useMemo(() => {
    if (!proposal_data) return false;

    const rewardStatus = snsRewardStatus(proposal_data);
    if (rewardStatus !== SnsProposalRewardStatus.PROPOSAL_REWARD_STATUS_ACCEPT_VOTES) return false;
    if (checkedNeuronIds.length === 0) return false;

    return true;
  }, [proposal_data, checkedNeuronIds]);

  return (
    <Box>
      <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "16px" }}>
        {t("nns.voting.results")}
      </Typography>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography sx={{ color: YesColor }}>{t("common.yes")}</Typography>
            <Typography sx={{ fontSize: "22px", fontWeight: 500, color: YesColor }}>
              {yesProportion !== undefined ? formatPercentage(yesProportion) : "--"}
            </Typography>
          </Box>
          <Box>
            <Typography align="right" sx={{ color: NoColor }}>
              {t("common.no")}
            </Typography>
            <Typography sx={{ fontSize: "22px", fontWeight: 500, color: NoColor }} align="right">
              {noProportion !== undefined ? formatPercentage(noProportion) : "--"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ margin: "20px 0 10px 0" }}>
          <Progressbar
            yes={yesProportion}
            no={noProportion}
            YesColor={YesColor}
            NoColor={NoColor}
            immediateMajorityPercent={immediateMajorityPercent}
            standardMajorityPercent={standardMajorityPercent}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography>
              <Typography sx={{ fontSize: "12px", color: YesColor }} component="span">
                {yes ? new BigNumber(yes).toFormat(0) : "--"}&nbsp;
              </Typography>
              <Typography sx={{ fontSize: "12px" }} component="span">
                {t("nns.voting.power")}
              </Typography>
            </Typography>

            <Typography sx={{ margin: "5px 0 0 0" }}>
              <Typography sx={{ fontSize: "12px", color: YesColor }} component="span">
                {castVotesYes !== undefined ? formatPercentage(castVotesYes) : "--"}&nbsp;
              </Typography>
              <Typography sx={{ fontSize: "12px" }} component="span">
                {t("nns.voting.of.cast")}
              </Typography>

              <Typography sx={{ fontSize: "12px" }}>
                {t("nns.voting.yes.needs", {
                  percent: immediateMajorityPercent === undefined ? "--" : `${immediateMajorityPercent}%`,
                })}
              </Typography>
            </Typography>
          </Box>

          {isExecuted ? null : (
            <Box>
              <Typography sx={{ fontSize: "12px", textAlign: "center" }}>{t("nns.voting.expiration")}</Typography>
              <Typography sx={{ fontSize: "12px", textAlign: "center", margin: "5px 0 0 0" }}>
                {seconds ? secondsToDuration({ seconds }) : "--"}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography sx={{ textAlign: "right" }}>
              <Typography sx={{ fontSize: "12px", color: NoColor }} component="span">
                {no ? new BigNumber(no).toFormat(0) : "--"}&nbsp;
              </Typography>
              <Typography sx={{ fontSize: "12px" }} component="span">
                {t("nns.voting.power")}
              </Typography>
            </Typography>

            <Typography sx={{ textAlign: "right", margin: "5px 0 0 0" }}>
              <Typography sx={{ fontSize: "12px", color: NoColor }} component="span">
                {castVotesNo !== undefined ? formatPercentage(castVotesNo) : "--"}&nbsp;
              </Typography>
              <Typography sx={{ fontSize: "12px" }} component="span">
                {t("nns.voting.of.cast")}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Typography color="text.primary" fontWeight={500}>
          {t("nns.voting.proposal.decided")}
        </Typography>

        <Box sx={{ margin: "10px 0 0 0" }}>
          <CollapseText
            label={<Typography>1. Immediate supermajority decision</Typography>}
            description={
              <Typography sx={{ fontSize: "12px", padding: "5px" }}>
                A critical proposal is immediately adopted or rejected if, before the voting period ends, more than 67%
                of the total voting power votes Yes, or at least 33% votes No, respectively (indicated by{" "}
                <Typography
                  component="span"
                  sx={{
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    background: theme.colors.primaryMain,
                    borderRadius: "50%",
                  }}
                />
                ).
              </Typography>
            }
          />
        </Box>

        <Box sx={{ margin: "5px 0 0 0" }}>
          <CollapseText
            label={<Typography>2. Standard supermajority decision</Typography>}
            description={
              <Typography sx={{ fontSize: "12px", padding: "5px" }}>
                At the end of the voting period, a critical proposal is adopted if more than 67% of the votes cast are
                Yes votes, provided these votes represent at least 20% of the total voting power (indicated by&nbsp;
                <Typography
                  component="span"
                  sx={{
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    background: theme.colors.secondaryMain,
                    borderRadius: "50%",
                  }}
                />
                ). Otherwise, it is rejected. Before a proposal is decided, the voting period can be extended in order
                to “wait for quiet”. Such voting period extensions occur when a proposal’s voting results turn from
                either a Yes majority to a No majority or vice versa.
              </Typography>
            }
          />
        </Box>
      </Box>

      <>
        <Box sx={{ margin: "30px 0 0 0" }}>
          <Box sx={{ display: "flex", gap: "0 10px" }}>
            <Box sx={{ flex: 1 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  background: theme.colors.successDark,
                  "&:hover": {
                    background: theme.colors.successDark,
                  },
                }}
                disabled={!canVote}
                onClick={handleAdopt}
              >
                {t("nns.adopt")}
              </Button>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  background: theme.colors.danger,
                  "&:hover": {
                    background: theme.colors.danger,
                  },
                }}
                disabled={!canVote}
                onClick={handleReject}
              >
                {t("nns.reject")}
              </Button>
            </Box>
          </Box>
        </Box>

        {voteableNeurons && proposal_data && voteableNeurons.length > 0 ? (
          <Box sx={{ margin: "10px 0 0 0" }}>
            <VotableNeurons
              voteableNeurons={voteableNeurons}
              onCheckedChange={handleCheckedNeuronIdsChange}
              proposal={proposal_data}
            />
          </Box>
        ) : (
          <Typography sx={{ margin: "10px 0 0 0" }}>{t("nns.voting.no.neurons.to.vote")}</Typography>
        )}

        <VotedNeurons votedNeurons={votedNeurons} proposal_data={proposal_data} />

        {ineligibleNeurons && ineligibleNeurons.length > 0 ? (
          <Box sx={{ margin: "20px 0 0 0" }}>
            <Box
              sx={{ display: "flex", gap: "0 5px", alignItems: "center", cursor: "pointer" }}
              onClick={() => setIneligibleOpen(!ineligibleOpen)}
            >
              <Typography>{t("nns.voting.ineligible.neurons", { number: ineligibleNeurons.length })}</Typography>
              <ChevronDown size="18px" style={{ transform: ineligibleOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </Box>
            <Collapse in={ineligibleOpen}>
              <Box sx={{ padding: "12px" }}>
                <Typography sx={{ fontSize: "12px" }}>{t("nns.voting.eligible.descriptions")}</Typography>

                <Box sx={{ margin: "20px 0 0 0", display: "flex", flexDirection: "column", gap: "10px 0" }}>
                  {ineligibleNeurons.map((ineligibleNeuron, index) => (
                    <Box
                      key={ineligibleNeuron.id[0]?.id ? toHexString(ineligibleNeuron.id[0]?.id) : `neuron_${index}`}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        "@media(max-width: 640px)": {
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        },
                      }}
                    >
                      <Typography sx={{ fontSize: "12px" }}>
                        {neuronFormat(ineligibleNeuron) ? shorten(neuronFormat(ineligibleNeuron).id, 12) : "--"}
                      </Typography>
                      {minimumDissolveDelaySeconds !== undefined ? (
                        <Typography sx={{ fontSize: "12px" }}>
                          {t("nns.voting.dissolve.delay.less", {
                            duration: secondsToDissolveDelayDuration(minimumDissolveDelaySeconds),
                          })}
                        </Typography>
                      ) : null}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Collapse>
          </Box>
        ) : null}

        <VoteConfirm
          governance_id={governance_id}
          proposal_id={proposal_id}
          proposal={proposal_data}
          rejected={!adopt}
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          votingPowers={votingPowers}
          voteNeurons={voteNeurons}
          onVoteCallEnded={onRefresh}
        />
      </>
    </Box>
  );
}
