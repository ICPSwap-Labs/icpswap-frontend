import React, { useState } from "react";
import { Box, Button, Typography, CircularProgress } from "components/Mui";
import { TokenImage, Flex, Modal, NoData } from "components/index";
import { useToken } from "hooks/useCurrency";
import { useAccountPrincipal } from "store/auth/hooks";
import { parseTokenAmount } from "@icpswap/utils";
import { useFarmUserRewards, farmWithdraw } from "@icpswap/hooks";
import { FarmInfo, ResultStatus } from "@icpswap/types";
import { useTips, MessageTypes } from "hooks/useTips";
import { useTranslation } from "react-i18next";

export interface ReclaimProps {
  farmId: string;
  farmInfo: FarmInfo | undefined;
}

export function Reclaim({ farmId, farmInfo }: ReclaimProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();

  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [refreshRewardsTrigger, setRefreshRewardsTrigger] = useState(0);
  const [reclaimOpen, setReclaimOpen] = React.useState(false);
  const [openTip] = useTips();

  const [, rewardToken] = useToken(farmInfo?.rewardToken.address);

  const { result: unclaimedRewards } = useFarmUserRewards(farmId, principal, refreshRewardsTrigger);

  const handleReclaim = async () => {
    if (withdrawLoading) return;

    setWithdrawLoading(true);

    const { status, message } = await farmWithdraw(farmId);

    if (status === ResultStatus.OK) {
      openTip(t`Withdraw successfully`, MessageTypes.success);
      setRefreshRewardsTrigger(refreshRewardsTrigger + 1);
      setReclaimOpen(false);
    } else {
      openTip(message !== "" ? message : t`Failed to withdraw`, MessageTypes.error);
    }

    setWithdrawLoading(false);
  };

  return (
    <Box mt="16px">
      <Box>
        <Typography sx={{ fontSize: "12px", lineHeight: "18px" }}>{t("limit.history.descriptions")}</Typography>
      </Box>

      <Box mt="16px 0 0 0">
        {unclaimedRewards && unclaimedRewards > BigInt(0) ? (
          <Flex justify="space-between">
            <Flex gap="0 12px">
              <TokenImage tokenId={rewardToken?.address} logo={rewardToken?.logo} size="32px" />
              <Typography color="text.primary">
                {rewardToken
                  ? `${parseTokenAmount(unclaimedRewards, rewardToken.decimals).toFormat()} ${rewardToken.symbol}`
                  : "--"}
              </Typography>
            </Flex>
            <Button
              variant="contained"
              size="small"
              onClick={handleReclaim}
              disabled={withdrawLoading}
              startIcon={withdrawLoading ? <CircularProgress color="inherit" size={20} /> : null}
            >
              {t("common.reclaim")}
            </Button>
          </Flex>
        ) : (
          <NoData />
        )}
      </Box>

      <Modal open={reclaimOpen} title="Reclaim" onClose={() => setReclaimOpen(false)}>
        {unclaimedRewards && unclaimedRewards > BigInt(0) ? (
          <Flex justify="space-between">
            <Flex gap="0 12px">
              <TokenImage tokenId={rewardToken?.address} logo={rewardToken?.logo} size="32px" />
              <Typography color="text.primary">
                {rewardToken
                  ? `${parseTokenAmount(unclaimedRewards, rewardToken.decimals).toFormat()} ${rewardToken.symbol}`
                  : "--"}
              </Typography>
            </Flex>
            <Button
              variant="contained"
              size="small"
              onClick={handleReclaim}
              disabled={withdrawLoading}
              startIcon={withdrawLoading ? <CircularProgress color="inherit" size={20} /> : null}
            >
              {t("common.reclaim")}
            </Button>
          </Flex>
        ) : (
          <NoData />
        )}
      </Modal>
    </Box>
  );
}
