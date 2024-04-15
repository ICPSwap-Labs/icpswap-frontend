import { Box, Button, Typography, useTheme } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { useMemo } from "react";
import type { ProposalData } from "@icpswap/types";
import { nowInSeconds, formatPercentage, BigNumber } from "@icpswap/utils";
import { CollapseText } from "components/index";
import { useParams } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import { secondsToDuration } from "@dfinity/utils";

interface ProgressbarProps {
  yes: number | undefined;
  no: number | undefined;
  YesColor: string;
  NoColor: string;
  standardMajorityPercent: number | undefined;
  immediateMajorityPercent: number | undefined;
}

function Progressbar({
  yes,
  no,
  YesColor,
  NoColor,
  immediateMajorityPercent,
  standardMajorityPercent,
}: ProgressbarProps) {
  const theme = useTheme() as Theme;

  return (
    <Box sx={{ position: "relative", width: "100%", height: "10px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "10px",
          borderRadius: "12px",
          background: theme.palette.background.level3,
        }}
      >
        <Box
          sx={{
            width: yes,
            height: "100%",
            borderTopLeftRadius: "12px",
            borderBottomLeftRadius: "12px",
            background: YesColor,
          }}
        />

        <Box
          sx={{
            width: no,
            height: "100%",
            borderTopRightRadius: "12px",
            borderBottomRightRadius: "12px",
            background: NoColor,
          }}
        />
      </Box>
      <Box sx={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0 }}>
        {immediateMajorityPercent ? (
          <Box
            className="immediate-majority"
            sx={{
              position: "absolute",
              bottom: 0,
              left: `${immediateMajorityPercent}%`,
              width: "2px",
              height: "16px",
              background: "#ffffff",
              transform: "translate(-50%, 0)",
              "&: after": {
                display: "block",
                position: "absolute",
                top: "-5px",
                left: "-2px",
                content: '" "',
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: theme.colors.primaryMain,
              },
            }}
          />
        ) : null}

        {standardMajorityPercent ? (
          <Box
            className="standard-majority"
            sx={{
              position: "absolute",
              bottom: 0,
              left: `${standardMajorityPercent}%`,
              width: "2px",
              height: "16px",
              background: "#ffffff",
              transform: "translate(-50%, 0)",
              "&: after": {
                display: "block",
                position: "absolute",
                top: "-5px",
                left: "-2px",
                content: '" "',
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: theme.colors.secondaryMain,
              },
            }}
          />
        ) : null}
      </Box>
    </Box>
  );
}

export interface ProposalDetailsProps {
  proposal_data: ProposalData | undefined;
}

export function VotingResult({ proposal_data }: ProposalDetailsProps) {
  const theme = useTheme() as Theme;
  const { proposal_id } = useParams<{ governance_id: string; proposal_id: string }>();

  console.log("proposal_data:", proposal_data);

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
  const NoColor = theme.colors.errorDark;

  return (
    <Box>
      <Typography sx={{ color: "text.primary", fontWeight: 500 }}>
        <Trans>Voting Result</Trans>
      </Typography>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography sx={{ color: YesColor }}>
              <Trans>Yes</Trans>
            </Typography>
            <Typography sx={{ fontSize: "22px", fontWeight: 500, color: YesColor }}>
              {yesProportion !== undefined ? formatPercentage(yesProportion) : "--"}
            </Typography>
          </Box>
          <Box>
            <Typography align="right" sx={{ color: NoColor }}>
              <Trans>No</Trans>
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
                <Trans>Voting Power</Trans>
              </Typography>
            </Typography>

            <Typography sx={{ margin: "5px 0 0 0" }}>
              <Typography sx={{ fontSize: "12px", color: YesColor }} component="span">
                {castVotesYes !== undefined ? formatPercentage(castVotesYes) : "--"}&nbsp;
              </Typography>
              <Typography sx={{ fontSize: "12px" }} component="span">
                <Trans>of cast votes</Trans>
              </Typography>

              <Typography sx={{ fontSize: "12px" }}>
                <Trans>
                  (Yes needs {immediateMajorityPercent === undefined ? "--" : `${immediateMajorityPercent}%`})
                </Trans>
              </Typography>
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontSize: "12px", textAlign: "center" }}>
              <Trans>Expiration date</Trans>
            </Typography>
            <Typography sx={{ fontSize: "12px", textAlign: "center", margin: "5px 0 0 0" }}>
              {seconds ? secondsToDuration({ seconds }) : "--"}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ textAlign: "right" }}>
              <Typography sx={{ fontSize: "12px", color: NoColor }} component="span">
                {no ? new BigNumber(no).toFormat(0) : "--"}&nbsp;
              </Typography>
              <Typography sx={{ fontSize: "12px" }} component="span">
                <Trans>Voting Power</Trans>
              </Typography>
            </Typography>

            <Typography sx={{ textAlign: "right", margin: "5px 0 0 0" }}>
              <Typography sx={{ fontSize: "12px", color: NoColor }} component="span">
                {castVotesNo !== undefined ? formatPercentage(castVotesNo) : "--"}&nbsp;
              </Typography>
              <Typography sx={{ fontSize: "12px" }} component="span">
                <Trans>of cast votes</Trans>
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Typography color="text.primary" fontWeight={500}>
          <Trans>There are two ways a critical proposal can be decided:</Trans>
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
            >
              <Trans>Adopt</Trans>
            </Button>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                background: theme.colors.errorDark,
                "&:hover": {
                  background: theme.colors.errorDark,
                },
              }}
            >
              <Trans>Reject</Trans>
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ margin: "10px 0 0 0" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>
            <Trans>Vote with 1/1 Neuron</Trans>
          </Typography>

          <Typography>
            <Trans>Voting Power: 39.24</Trans>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
