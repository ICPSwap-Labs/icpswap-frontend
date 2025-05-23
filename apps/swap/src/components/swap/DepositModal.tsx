import { useCallback, useMemo, useState } from "react";
import { Typography, Button, Box } from "components/Mui";
import { MaxButton, NumberTextField } from "components/index";
import { BigNumber, isNullArgs, nonNullArgs, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Token, Pool } from "@icpswap/swap-sdk";
import { Flex, Modal } from "@icpswap/ui";
import PercentageSlider from "components/PercentageSlider/ui";
import { useTokenBalance } from "hooks/token";
import { useAccountPrincipal } from "store/auth/hooks";
import { useSwapDepositTokenBalance } from "hooks/swap/useSwapDeposit";
import { MessageTypes, useTips } from "hooks/useTips";
import { useTranslation } from "react-i18next";

export interface DepositModalProps {
  open: boolean;
  token: Token;
  pool: Pool;
  onClose: () => void;
  onDepositSuccess: () => void;
}

export function DepositModal({ open, onClose, token, pool, onDepositSuccess }: DepositModalProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const [openTip, closeTip] = useTips();

  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);
  const [amount, setAmount] = useState<string>("");

  const { result: balance } = useTokenBalance(token.address, principal);

  const maxDepositAmount = useMemo(() => {
    if (!balance || !token) return undefined;
    if (balance.isEqualTo(0)) return undefined;

    return parseTokenAmount(balance.minus(token.transFee), token.decimals).toString();
  }, [balance, token]);

  const handleMax = useCallback(() => {
    if (maxDepositAmount) {
      setAmount(maxDepositAmount);
      setPercent(100);
    }
  }, [maxDepositAmount]);

  const handleSliderChange = useCallback(
    (event, value) => {
      setPercent(value);

      if (balance && token) {
        if (balance.isLessThan(token.transFee)) return;

        const amount = parseTokenAmount(balance.minus(token.transFee), token.decimals)
          .multipliedBy(value)
          .dividedBy(100);

        setAmount(amount.toString());
      }
    },
    [balance, token],
  );

  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const amount = event.target.value;
      setAmount(amount);

      if (amount === "") {
        setPercent(0);
        return;
      }

      if (maxDepositAmount) {
        if (new BigNumber(amount).isGreaterThan(maxDepositAmount)) {
          setPercent(100);
        } else {
          setPercent(Number(new BigNumber(amount).dividedBy(maxDepositAmount).multipliedBy(100).toFixed(1)));
        }
      }
    },
    [maxDepositAmount, setPercent],
  );

  const depositCallback = useSwapDepositTokenBalance();

  const handleDeposit = useCallback(async () => {
    if (!amount || !token || !pool || loading) return;

    onClose();

    setLoading(true);

    const key = openTip(
      t("common.deposit.amount", {
        amount: `${toSignificantWithGroupSeparator(amount)} ${token.symbol}`,
      }),
      MessageTypes.loading,
    );

    const result = await depositCallback({ amount, token, pool });

    closeTip(key);

    if (result) {
      openTip("Deposit successfully", MessageTypes.success);
      onDepositSuccess();
    }

    setLoading(false);
  }, [openTip, closeTip, depositCallback, amount, onClose, token, pool, loading, setLoading, onDepositSuccess]);

  const error = useMemo(() => {
    if (amount === "") return t("common.enter.input.amount");
    if (nonNullArgs(balance) && balance.isLessThan(amount)) return t("common.error.insufficient.balance");
    if (isNullArgs(balance) || !token || isNullArgs(maxDepositAmount)) return t`Confirm`;
    if (new BigNumber(maxDepositAmount).isLessThan(amount)) return t("common.error.insufficient.balance");

    return undefined;
  }, [amount, balance, token, maxDepositAmount]);

  return (
    <Modal open={open} title={t`Deposit`} onClose={onClose} background="level1">
      <NumberTextField
        fullWidth
        placeholder={t("common.enter.input.amount")}
        numericProps={{
          decimalScale: Number(token.decimals),
          allowNegative: false,
          maxLength: 15,
        }}
        value={amount}
        onChange={handleAmountChange}
      />

      <Flex sx={{ margin: "12px 0 0 0" }} gap="0 4px">
        <Typography>
          Balance: {balance && token ? parseTokenAmount(balance, token.decimals).toFormat() : "--"}
        </Typography>
        <MaxButton onClick={handleMax} />
      </Flex>

      <Box mt="20px" sx={{ padding: "0 10px 0 0" }}>
        <PercentageSlider value={percent} onChange={handleSliderChange} />
      </Box>

      <Button
        size="large"
        variant="contained"
        fullWidth
        sx={{ margin: "20px 0 0 0 " }}
        onClick={handleDeposit}
        disabled={error !== undefined}
      >
        {error ?? t`Confirm`}
      </Button>
    </Modal>
  );
}
