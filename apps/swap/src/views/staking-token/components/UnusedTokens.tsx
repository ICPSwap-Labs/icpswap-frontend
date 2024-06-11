import { useState } from "react";
import { Modal } from "@icpswap/ui";
import { Typography, Box, Button } from "@mui/material";
import { useTheme } from "@mui/styles";
import { NoData, LoadingRow, TabPanel, type TabPanelProps, TokenImage, Flex } from "components/index";
import { parseTokenAmount } from "@icpswap/utils";
import { ResultStatus } from "@icpswap/types";
import { t, Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { useTips, MessageTypes, useFullscreenLoading } from "hooks/useTips";
import { useUserUnusedTokens } from "hooks/staking-token/index";
import { stakingPoolClaim, stakingPoolWithdraw } from "@icpswap/hooks";
import { usePendingRewards } from "hooks/staking-token/usePendingRewards";

interface ReclaimItemProps {
  tokenId: string;
  poolId: string;
  balance: bigint;
  onReclaim: (poolId: string, balance: bigint) => void;
}

function ReclaimItem({ tokenId, poolId, balance, onReclaim }: ReclaimItemProps) {
  const { result: token } = useTokenInfo(tokenId);

  return (
    <Flex justify="space-between" sx={{ padding: "16px 0" }}>
      <Flex gap="0 12px">
        <TokenImage logo={token?.logo} size="32px" />
        <Box>
          <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "text.primary" }}>
            {parseTokenAmount(balance, token?.decimals).toFormat()}
          </Typography>
          <Typography sx={{ margin: "8px 0 0 0" }}>{token?.symbol ?? "--"}</Typography>
        </Box>
      </Flex>

      <Box>
        <Button size="small" variant="contained" onClick={() => onReclaim(poolId, balance)}>
          <Trans>Reclaim</Trans>
        </Button>
      </Box>
    </Flex>
  );
}

function PendingRewards() {
  const [openTip] = useTips();
  const [trigger, setTrigger] = useState(0);
  const [openFullscreen, closeFullscreen] = useFullscreenLoading();
  const { loading, result } = usePendingRewards(trigger);

  const handleReclaim = async (poolId: string, balance: bigint) => {
    openFullscreen();

    const { status, message } = await stakingPoolWithdraw(poolId, false, balance);

    if (status === ResultStatus.ERROR) {
      openTip(message ?? t`Failed to reclaim`, MessageTypes.error);
    } else {
      openTip("Reclaim successfully", MessageTypes.success);
      setTrigger(trigger + 1);
    }

    closeFullscreen();
  };

  return loading ? (
    <Box sx={{ padding: "20px 0" }}>
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
  ) : result.length === 0 ? (
    <NoData />
  ) : (
    <Box>
      {result.map((ele) => (
        <ReclaimItem
          key={ele.poolId}
          poolId={ele.poolId}
          balance={ele.amount}
          tokenId={ele.rewardTokenId}
          onReclaim={handleReclaim}
        />
      ))}
    </Box>
  );
}

function FailedStakedTokens() {
  const [openTip] = useTips();
  const [trigger, setTrigger] = useState(0);
  const [openFullscreen, closeFullscreen] = useFullscreenLoading();
  const { loading, result } = useUserUnusedTokens(trigger);

  const handleReclaim = async (poolId: string) => {
    openFullscreen();

    const { status, message } = await stakingPoolClaim(poolId);

    if (status === ResultStatus.ERROR) {
      openTip(message ?? t`Failed to reclaim`, MessageTypes.error);
    } else {
      openTip("Reclaim successfully", MessageTypes.success);
      setTrigger(trigger + 1);
    }

    closeFullscreen();
  };

  return loading ? (
    <Box sx={{ padding: "20px 0" }}>
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
  ) : result.length === 0 ? (
    <NoData />
  ) : (
    <Box>
      {result.map((ele) => (
        <ReclaimItem
          key={ele.poolId}
          poolId={ele.poolId}
          balance={ele.balance}
          tokenId={ele.rewardTokenId}
          onReclaim={handleReclaim}
        />
      ))}
    </Box>
  );
}

export interface WithdrawTokensModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WithdrawUnusedTokens({ open, onClose }: WithdrawTokensModalProps) {
  const theme = useTheme() as Theme;
  const [tab, setTab] = useState<"subaccount" | "reward">("subaccount");

  const tabs = [
    { key: "subaccount", value: "Failed Staked Tokens" },
    {
      key: "reward",
      value: "Pending Reward Tokens",
    },
  ];

  const handleTabChange: TabPanelProps["onChange"] = (tab) => {
    setTab(tab.key);
  };

  return (
    <Modal open={open} title={t`Reclaim`} onClose={onClose} background={theme.palette.background.level1}>
      <TabPanel
        active={tab}
        tabs={tabs}
        fullWidth
        bg0={theme.palette.background.level3}
        bg1={theme.palette.background.level1}
        fontNormal
        fontSize="16px"
        onChange={handleTabChange}
      />

      {tab === "subaccount" ? <FailedStakedTokens /> : null}
      {tab === "reward" ? <PendingRewards /> : null}
    </Modal>
  );
}
