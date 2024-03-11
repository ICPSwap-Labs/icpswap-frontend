import { Box, Avatar } from "@mui/material";
import { toSignificant, parseTokenAmount, BigNumber } from "@icpswap/utils";
import { Currency } from "@icpswap/swap-sdk";
import { t, Trans } from "@lingui/macro";
import { TextButton } from "components/index";
import { BURN_FIELD } from "constants/swap";
import { toFormat } from "utils/index";
import { Principal } from "@dfinity/principal";
import { getDecreaseLiquidityAmount } from "store/swap/hooks";
import { shorten } from "@icpswap/utils";

export interface DecreaseLiquidityStepsProps {
  formattedAmounts: { [key in BURN_FIELD]?: string };
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
  positionId: bigint;
  principal: Principal | undefined;
  handleReclaim: () => void;
  key: string;
}

function TokenAmount({ logo, amount }: { logo: string; amount: string | undefined }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar sx={{ width: "16px", height: "16px", margin: "0 4px 0 0" }} src={logo}>
        &nbsp;
      </Avatar>
      {amount ?? "--"}
    </Box>
  );
}

export function getDecreaseLiquiditySteps({
  formattedAmounts,
  currencyA,
  currencyB,
  positionId,
  principal,
  handleReclaim,
  key,
}: DecreaseLiquidityStepsProps) {
  const { amount0, amount1 } = getDecreaseLiquidityAmount(key) ?? {};

  const withdrawAmountA =
    amount0 === undefined
      ? undefined
      : toSignificant(parseTokenAmount(amount0, currencyA?.decimals).toFixed(), 12, {
          groupSeparator: ",",
        });
  const withdrawAmountB =
    amount1 === undefined
      ? undefined
      : toSignificant(parseTokenAmount(amount1, currencyB?.decimals).toFixed(), 12, {
          groupSeparator: ",",
        });

  const withdrawAmountALessThanZero =
    amount0 === undefined
      ? false
      : amount0 === BigInt(0)
      ? false
      : !currencyA
      ? false
      : new BigNumber((amount0 - BigInt(currencyA.transFee)).toString()).isLessThan(0);

  const withdrawAmountBLessThanZero =
    amount1 === undefined
      ? false
      : amount1 === BigInt(0)
      ? false
      : !currencyB
      ? false
      : new BigNumber((amount1 - BigInt(currencyB.transFee)).toString()).isLessThan(0);

  return currencyA && currencyB
    ? [
        {
          title: `Remove liquidity ${currencyA?.symbol} and ${currencyB.symbol}`,
          step: 0,
          children: [
            { label: t`Position ID`, value: positionId.toString() },
            {
              label: `${currencyA.symbol}`,
              value: <TokenAmount amount={toFormat(formattedAmounts[BURN_FIELD.CURRENCY_A])} logo={currencyA.logo} />,
            },
            {
              label: `${currencyB.symbol}`,
              value: <TokenAmount amount={toFormat(formattedAmounts[BURN_FIELD.CURRENCY_B])} logo={currencyB.logo} />,
            },
          ],
        },
        {
          title: withdrawAmountALessThanZero
            ? t`Unable to withdraw ${currencyA.symbol}`
            : t`Withdraw ${currencyA.symbol}`,
          step: 1,
          children: [
            {
              label: t`Amount`,
              value: <TokenAmount amount={withdrawAmountA} logo={currencyA.logo} />,
            },
            { label: t`Principal ID`, value: shorten(principal?.toString() ?? "", 6) },
          ],
          skipError: withdrawAmountALessThanZero
            ? t`The amount of withdrawal is less than the transfer fee`
            : undefined,
          errorActions: [
            <TextButton onClick={handleReclaim}>
              <Trans>Reclaim</Trans>
            </TextButton>,
          ],
          errorMessage: t`Please click Reclaim your tokens if they've transferred to the swap pool.`,
        },
        {
          title: withdrawAmountBLessThanZero
            ? t`Unable to withdraw ${currencyB.symbol}`
            : t`Withdraw ${currencyB.symbol}`,
          step: 2,
          children: [
            {
              label: t`Amount`,
              value: <TokenAmount amount={withdrawAmountB} logo={currencyB.logo} />,
            },
            { label: t`Principal ID`, value: shorten(principal?.toString() ?? "", 6) },
          ],
          skipError: withdrawAmountBLessThanZero
            ? t`The amount of withdrawal is less than the transfer fee`
            : undefined,
          errorActions: [
            <TextButton onClick={handleReclaim}>
              <Trans>Reclaim</Trans>
            </TextButton>,
          ],
          errorMessage: t`Please click Reclaim your tokens if they've transferred to the swap pool.`,
        },
      ]
    : [];
}
