import { useState, useMemo } from "react";
import { Grid, Typography, Box, useTheme } from "components/Mui";
import { ResultStatus, ProposalInfo } from "@icpswap/types";
import { AuthButton } from "components/index";
import { useSuccessTip, useErrorTip } from "hooks/useTips";
import { getLocaleMessage } from "i18n/service";
import { useUserVotePower } from "hooks/voting/useUserVotePower";
import { useAccount } from "store/auth/hooks";
import { voting, useVotingProposal } from "@icpswap/hooks";
import BigNumber from "bignumber.js";
import { useTranslation } from "react-i18next";

import VoteConfirm from "./VoteConfirm";

export interface CastVotesProps {
  proposal: ProposalInfo;
  onVoteSuccess: () => void;
}

export function CastVotes({ proposal, onVoteSuccess }: CastVotesProps) {
  const { t } = useTranslation();
  const [openSuccessTip] = useSuccessTip();
  const [openErrorTip] = useErrorTip();
  const account = useAccount();

  const [showConfirm, setShowConfirm] = useState(false);
  const [activeVote, setActiveVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const isClosed = proposal?.state === BigInt(3);

  const { result: powers } = useUserVotePower(proposal.storageCanisterId, proposal.id, account, 0, 10, reload);
  const noPower = powers === BigInt(0) || !powers;

  const handleVote = async () => {
    if (loading || noPower || !powers || !activeVote) return;

    setLoading(true);
    setShowConfirm(false);

    const { status, message } = await voting(true, proposal.storageCanisterId, proposal.id, activeVote, Number(powers));

    if (status === ResultStatus.OK) {
      openSuccessTip(t`Voted successfully`);
      setActiveVote(null);
      onVoteSuccess();
      setReload(!reload);
    } else {
      openErrorTip(getLocaleMessage(message) ?? t`Failed to vote`);
    }

    setLoading(false);
  };

  return (
    <Box>
      {proposal.options.map((option, index) => (
        <Box
          key={`${option.k}-${index}`}
          sx={{
            border: "1px solid #4F5A84",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            height: "48px",
            justifyContent: "center",
            cursor: "pointer",
            marginBottom: "20px",
            "&:hover": {
              border: "1px solid #5569DB",
            },
            "&.active": {
              border: "1px solid #5569DB",
            },
          }}
          onClick={() => setActiveVote(option.k)}
          className={`${activeVote === option.k ? "active" : ""}`}
        >
          <Typography color="text.primary" fontWeight="500" align="center">
            {option.k}
          </Typography>
        </Box>
      ))}

      <AuthButton
        fullWidth
        size="large"
        variant="contained"
        onClick={() => setShowConfirm(true)}
        disabled={loading || !activeVote || isClosed}
        loading={loading}
      >
        {isClosed ? t("common.closed") : t("common.vote")}
      </AuthButton>

      {showConfirm ? (
        <VoteConfirm
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleVote}
          optionLabel={activeVote}
          powers={powers}
          noPower={noPower}
        />
      ) : null}
    </Box>
  );
}

export function VotesResult({ proposal: _proposal }: { proposal: ProposalInfo }) {
  const { t } = useTranslation();
  const { result: proposal } = useVotingProposal(_proposal.storageCanisterId, _proposal.id);

  const theme = useTheme();

  const total = useMemo(() => {
    return proposal?.options.reduce(
      (prevValue, currentValue) => {
        return { k: "", v: currentValue.v + prevValue.v };
      },
      { k: "initialValue", v: BigInt(0) },
    ).v;
  }, [proposal]);

  return (
    <Box>
      {_proposal.options.map((option, index) => {
        const _option = proposal?.options.find((pro) => pro.k === option.k);

        const percent =
          Number(total) === 0
            ? new BigNumber(0)
            : total && _option?.v
            ? new BigNumber(String(_option?.v ?? 0)).dividedBy(String(total ?? 0)).multipliedBy(100)
            : new BigNumber(0);

        return (
          <Box key={`${option.k}-${index}`} sx={{ marginBottom: "40px", "&:last-child": { marginBottom: "0px" } }}>
            <Grid container>
              <Grid item xs>
                <Typography fontSize={12} component="span">
                  {option.k}
                </Typography>
                <Typography fontSize={12} sx={{ marginLeft: "5px" }} component="span">
                  {percent.toFixed(2)}%
                </Typography>
              </Grid>

              <Typography fontSize={12}>
                {t("vote.votes.amount", { amount: new BigNumber(String(_option?.v ?? 0)).toFormat() })}
              </Typography>
            </Grid>

            <Box
              sx={{
                background: theme.palette.background.level4,
                height: "10px",
                borderRadius: "4px",
                marginTop: "8px",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "10px",
                  background: "linear-gradient(89.44deg, #5569DB -0.31%, #8572FF 91.14%)",
                  width: `${percent.toFixed(2)}%`,
                  borderRadius: "4px",
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
