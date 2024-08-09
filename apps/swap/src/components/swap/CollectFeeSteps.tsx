import { Box, Avatar } from "@mui/material";
import { Token, CurrencyAmount } from "@icpswap/swap-sdk";
import { formatTokenAmount, shorten } from "@icpswap/utils";
import { t, Trans } from "@lingui/macro";
import { TextButton } from "components/index";
import { Principal } from "@dfinity/principal";

export interface CollectStepsProps {
  positionId: bigint;
  retry?: () => Promise<boolean>;
  currencyFeeAmount0: CurrencyAmount<Token>;
  currencyFeeAmount1: CurrencyAmount<Token>;
  principal: Principal | undefined;
  handleReclaim: () => void;
}

function TokenAmount({ logo, amount }: { logo: string; amount: string | undefined }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar sx={{ width: "16px", height: "16px", margin: "0 4px 0 0" }} src={logo}>
        &nbsp;
      </Avatar>
      {amount ?? 0}
    </Box>
  );
}

export function getCollectFeeSteps({
  positionId,
  retry,
  currencyFeeAmount0,
  currencyFeeAmount1,
  principal,
  handleReclaim,
}: CollectStepsProps) {
  const principalString = shorten(principal?.toString() ?? "", 12);

  const withdrawAmountA = currencyFeeAmount0.toSignificant(12, { groupSeparator: "," });
  const _withdrawAmountA = currencyFeeAmount0.toSignificant(12);
  const withdrawAmountB = currencyFeeAmount1.toSignificant(12, { groupSeparator: "," });
  const _withdrawAmountB = currencyFeeAmount1.toSignificant(12);

  const tokenA = currencyFeeAmount0.currency.wrapped;
  const tokenB = currencyFeeAmount1.currency.wrapped;

  const withdrawAmountALessThanZero = formatTokenAmount(_withdrawAmountA, tokenA.decimals)
    .minus(tokenA.transFee)
    .isLessThan(0);

  const withdrawAmountBLessThanZero = formatTokenAmount(_withdrawAmountB, tokenB.decimals)
    .minus(tokenB.transFee)
    .isLessThan(0);

  return [
    {
      title: `Collect ${tokenA.symbol} and ${tokenB.symbol}`,
      step: 0,
      children: [
        { label: t`Position ID`, value: positionId.toString() },
        {
          label: t`Token0`,
          value: <TokenAmount amount={withdrawAmountA} logo={tokenA.logo} />,
        },
        {
          label: t`Token1`,
          value: <TokenAmount amount={withdrawAmountB} logo={tokenB.logo} />,
        },
      ],
      errorActions: [
        <TextButton onClick={retry}>
          <Trans>Retry</Trans>
        </TextButton>,
      ],
    },
    {
      title:
        withdrawAmountALessThanZero && withdrawAmountBLessThanZero
          ? t`Unable to withdraw ${tokenA.symbol} and ${tokenB.symbol}`
          : t`Withdraw ${tokenA.symbol} and ${tokenB.symbol}`,
      step: 1,
      children: [
        {
          label: t`Amount0`,
          value: <TokenAmount amount={withdrawAmountA} logo={tokenA.logo} />,
        },
        {
          label: t`Amount1`,
          value: <TokenAmount amount={withdrawAmountB} logo={tokenB.logo} />,
        },
        { label: t`Principal ID`, value: principalString },
      ],
      errorActions: [
        <TextButton onClick={handleReclaim}>
          <Trans>Reclaim</Trans>
        </TextButton>,
        <TextButton onClick={retry}>
          <Trans>Retry</Trans>
        </TextButton>,
      ],
      errorMessage: t`Please click Reclaim your tokens if they've transferred to the swap pool.`,
      skipError:
        withdrawAmountALessThanZero && withdrawAmountBLessThanZero
          ? t`The amount of withdrawal is less than the transfer fee`
          : undefined,
    },
  ];
}
