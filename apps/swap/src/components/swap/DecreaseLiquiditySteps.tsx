import { Box, Avatar } from "components/Mui";
import { toSignificant, parseTokenAmount, BigNumber, shorten } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { TextButton } from "components/index";
import { BURN_FIELD } from "constants/swap";
import { toFormat } from "utils/index";
import { Principal } from "@dfinity/principal";
import { getDecreaseLiquidityAmount } from "store/swap/hooks";
import { StepContents } from "types/step";
import i18n from "i18n/index";

export interface DecreaseLiquidityStepsProps {
  formattedAmounts: { [key in BURN_FIELD]?: string };
  currencyA: Token | undefined;
  currencyB: Token | undefined;
  positionId: bigint;
  principal: Principal | undefined;
  handleReclaim: () => void;
  key: string;
  keepTokenInPools?: boolean;
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
  keepTokenInPools,
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

  const contents =
    currencyA && currencyB
      ? [
          {
            title: `Remove liquidity ${currencyA?.symbol} and ${currencyB.symbol}`,
            step: 0,
            children: [
              { label: i18n.t("common.position.id"), value: positionId.toString() },
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
          !keepTokenInPools
            ? {
                title: withdrawAmountALessThanZero
                  ? i18n.t("common.unable.withdraw", { symbol: currencyA.symbol })
                  : i18n.t("common.withdraw.amount", { symbol: currencyA.symbol }),
                step: 1,
                children: [
                  {
                    label: i18n.t("common.amount"),
                    value: <TokenAmount amount={withdrawAmountA} logo={currencyA.logo} />,
                  },
                  { label: i18n.t("common.principal.id"), value: shorten(principal?.toString() ?? "", 6) },
                ],
                skipError: withdrawAmountALessThanZero ? i18n.t("common.amount.withdrawal.less.than.fee") : undefined,
                errorActions: [<TextButton onClick={handleReclaim}>{i18n.t("common.reclaim")}</TextButton>],
                errorMessage: i18n.t("common.check.balance.tips"),
              }
            : null,
          !keepTokenInPools
            ? {
                title: withdrawAmountBLessThanZero
                  ? i18n.t("common.unable.withdraw", { symbol: currencyB.symbol })
                  : i18n.t("common.withdraw.amount", { symbol: currencyB.symbol }),
                step: 2,
                children: [
                  {
                    label: i18n.t("common.amount"),
                    value: <TokenAmount amount={withdrawAmountB} logo={currencyB.logo} />,
                  },
                  { label: i18n.t("common.principal.id"), value: shorten(principal?.toString() ?? "", 6) },
                ],
                skipError: withdrawAmountBLessThanZero ? i18n.t("common.amount.withdrawal.less.than.fee") : undefined,
                errorActions: [<TextButton onClick={handleReclaim}>{i18n.t("common.reclaim")}</TextButton>],
                errorMessage: i18n.t("common.check.balance.tips"),
              }
            : undefined,
        ]
      : [];

  return contents.filter((e) => !!e) as StepContents[];
}
