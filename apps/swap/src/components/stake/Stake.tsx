import { useCallback, useMemo, useState } from "react";
import { Typography, Button, Box } from "components/Mui";
import { MainCard, Flex, TokenImage, NumberTextField, MaxButton, StepViewButton } from "components/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { t, Trans } from "@lingui/macro";
import {
  parseTokenAmount,
  formatDollarAmount,
  toSignificantWithGroupSeparator,
  BigNumber,
  formatTokenAmount,
} from "@icpswap/utils";
import { useUSDPrice } from "hooks/useUSDPrice";
import { StakingPoolInfo, StakingState } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import { useStakeCall } from "hooks/staking-token/useStake";
import { useLoadingTip, useTips, MessageTypes } from "hooks/useTips";
import { TOKEN_STANDARD } from "@icpswap/token-adapter";
import PercentageSlider from "components/PercentageSlider/ui";
import { useStakingPoolState } from "@icpswap/hooks";

export interface StakeProps {
  poolId: string | undefined;
  poolInfo: StakingPoolInfo | undefined;
  stakeToken: Token | undefined;
  rewardToken: Token | undefined;
  balance: BigNumber | undefined;
  onStakeSuccess?: () => void;
}

export function Stake({ poolId, poolInfo, balance, stakeToken, rewardToken, onStakeSuccess }: StakeProps) {
  const principal = useAccountPrincipal();
  const [percent, setPercent] = useState(0);
  const [amount, setAmount] = useState<string>("");

  const stakeTokenPrice = useUSDPrice(stakeToken);

  const [openLoadingTip, closeLoadingTip] = useLoadingTip();
  const [openTip] = useTips();
  const getStakeCall = useStakeCall();

  const state = useStakingPoolState(poolInfo);

  const handleMax = useCallback(() => {
    if (balance && stakeToken) {
      if (!balance.isLessThan(stakeToken.transFee)) {
        const amount = parseTokenAmount(balance.minus(stakeToken.transFee), stakeToken.decimals).toString();

        setAmount(amount);
        setPercent(100);
      } else {
        setAmount(parseTokenAmount(balance, stakeToken.decimals).toString());
      }
    }
  }, [balance, stakeToken]);

  const handleAmountChange = useCallback(
    (amount: string) => {
      setAmount(amount);

      if (amount === "") {
        setPercent(0);
        return;
      }

      if (balance && stakeToken) {
        const _balance = parseTokenAmount(balance, stakeToken.decimals);

        if (!_balance.isGreaterThan(amount)) {
          setPercent(100);
        } else {
          setPercent(Number(new BigNumber(amount).dividedBy(_balance).multipliedBy(100).toFixed(0)));
        }
      }
    },
    [balance, stakeToken],
  );

  const handleSliderChange = useCallback(
    (event, value) => {
      setPercent(value);

      if (balance && stakeToken) {
        if (balance.isLessThan(stakeToken.transFee)) return;

        const amount = parseTokenAmount(balance.minus(stakeToken.transFee), stakeToken.decimals)
          .multipliedBy(value)
          .dividedBy(100);

        setAmount(amount.toString());
      }
    },
    [balance, stakeToken],
  );

  const handleStaking = async () => {
    if (!stakeToken || !principal || !poolInfo || !amount || !rewardToken || !poolId) return;

    const { call, key } = getStakeCall({
      token: stakeToken,
      amount: formatTokenAmount(amount, stakeToken.decimals).toFixed(0),
      poolId,
      standard: poolInfo.stakingToken.standard as TOKEN_STANDARD,
      rewardToken,
    });

    const loadingTipKey = openLoadingTip(`Staking ${stakeToken.symbol}`, {
      extraContent: <StepViewButton step={key} />,
    });

    const result = await call();

    if (result) {
      openTip(t`Stake successfully`, MessageTypes.success);
      if (onStakeSuccess) onStakeSuccess();
      handleAmountChange("");
    }

    closeLoadingTip(loadingTipKey);
  };

  const error = useMemo(() => {
    if (!state) return t`Stake`;
    if (state !== StakingState.LIVE) return t`Stake`;
    if (!stakeToken || !balance) return t`Stake`;
    if (!amount) return t`Enter the amount`;
    if (new BigNumber(amount).isEqualTo(0)) return t`Amount must be greater than 0`;
    if (parseTokenAmount(balance, stakeToken.decimals).isLessThan(amount)) return t`Insufficient balance`;
    if (!parseTokenAmount(stakeToken.transFee, stakeToken.decimals).isLessThan(amount))
      return t`Amount must be greater than the transfer fee`;

    return null;
  }, [amount, balance, stakeToken, state]);

  return (
    <>
      <MainCard padding="24px 16px" level={4} borderRadius="16px 16px 0 0">
        <Flex justify="space-between" sx={{ width: "100%" }}>
          <Flex gap="0 8px">
            <TokenImage logo={stakeToken?.logo} tokenId={stakeToken?.address} size="28px" />
            <Typography sx={{ fontSize: "18px", fontWeight: 500, color: "text.primary" }}>
              {stakeToken ? stakeToken.symbol : "--"}
            </Typography>
          </Flex>

          {stakeToken ? (
            <NumberTextField
              value={amount}
              fullWidth
              placeholder="0.00"
              variant="standard"
              sx={{
                "& input": {
                  textAlign: "right",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "text.primary",
                },
                "& input::placeholder": {
                  fontSize: "20px",
                  fontWeight: 600,
                },
              }}
              numericProps={{
                thousandSeparator: true,
                decimalScale: stakeToken.decimals,
                allowNegative: false,
                maxLength: 20,
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleAmountChange(event.target.value);
              }}
            />
          ) : null}
        </Flex>

        <Flex justify="space-between" sx={{ margin: "8px 0 0 0", width: "100%" }}>
          <Flex gap="0 5px">
            <Typography>
              <Trans>Balance:</Trans>&nbsp;
              {balance && stakeToken
                ? toSignificantWithGroupSeparator(parseTokenAmount(balance, stakeToken.decimals).toString(), 8)
                : "--"}
            </Typography>

            <MaxButton onClick={handleMax} background="rgba(86, 105, 220, 0.50)" />
          </Flex>

          <Typography>
            {stakeToken && amount && stakeTokenPrice
              ? formatDollarAmount(new BigNumber(amount).multipliedBy(stakeTokenPrice).toString())
              : "--"}
          </Typography>
        </Flex>

        <Box mt="24px" sx={{ padding: "0 10px 0 0" }}>
          <PercentageSlider value={percent} onChange={handleSliderChange} />
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ margin: "20px 0 0 0", height: "48px" }}
          disabled={!!error}
          onClick={handleStaking}
        >
          {error ?? <Trans>Stake</Trans>}
        </Button>
      </MainCard>
    </>
  );
}
