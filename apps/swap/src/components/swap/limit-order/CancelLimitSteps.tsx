import { Box, Avatar } from "@mui/material";
import { toSignificant, parseTokenAmount, BigNumber, shorten } from "@icpswap/utils";
import { Position } from "@icpswap/swap-sdk";
import { t, Trans } from "@lingui/macro";
import { TextButton } from "components/index";
import { toFormat } from "utils/index";
import { Principal } from "@dfinity/principal";
import { getDecreaseLiquidityAmount } from "store/swap/hooks";
import { StepContents } from "types/step";

export interface CancelLimitStepsProps {
  positionId: bigint;
  principal: Principal | undefined;
  position: Position;
  key: string;
  keepTokenInPools?: boolean;
  handleReclaim: () => void;
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

export function getCancelLimitSteps({
  positionId,
  principal,
  handleReclaim,
  key,
  keepTokenInPools,
  position,
}: CancelLimitStepsProps) {
  const { amount0, amount1 } = getDecreaseLiquidityAmount(key) ?? {};

  const token = position.amount0.equalTo(0) ? position.pool.token1 : position.pool.token0;
  const amount = position.amount0.equalTo(0) ? amount1 : amount0;

  const withdrawAmount =
    amount === undefined
      ? undefined
      : toSignificant(parseTokenAmount(amount, token.decimals).toFixed(), 12, {
          groupSeparator: ",",
        });

  const withdrawAmountLessThanZero =
    amount === undefined
      ? false
      : amount === BigInt(0)
      ? false
      : !token
      ? false
      : new BigNumber((amount - BigInt(token.transFee)).toString()).isLessThan(0);

  const contents =
    token && amount
      ? [
          {
            title: `Remove liquidity ${position.pool.token0.symbol} and ${position.pool.token1.symbol}`,
            step: 0,
            children: [
              { label: t`Position ID`, value: positionId.toString() },
              {
                label: `${token.symbol}`,
                value: <TokenAmount amount={toFormat(withdrawAmount)} logo={token.logo} />,
              },
            ],
          },
          !keepTokenInPools
            ? {
                title: withdrawAmountLessThanZero ? t`Unable to withdraw ${token.symbol}` : t`Withdraw ${token.symbol}`,
                step: 1,
                children: [
                  {
                    label: t`Amount`,
                    value: <TokenAmount amount={withdrawAmount} logo={token.logo} />,
                  },
                  { label: t`Principal ID`, value: shorten(principal?.toString() ?? "", 6) },
                ],
                skipError: withdrawAmountLessThanZero
                  ? t`The amount of withdrawal is less than the transfer fee`
                  : undefined,
                errorActions: [
                  <TextButton onClick={handleReclaim}>
                    <Trans>Reclaim</Trans>
                  </TextButton>,
                ],
                errorMessage: t`Please check your balance in the Swap Pool to see if tokens have been transferred to the Swap Pool.`,
              }
            : null,
          // !keepTokenInPools
          //   ? {
          //       title: withdrawAmountBLessThanZero
          //         ? t`Unable to withdraw ${currencyB.symbol}`
          //         : t`Withdraw ${currencyB.symbol}`,
          //       step: 2,
          //       children: [
          //         {
          //           label: t`Amount`,
          //           value: <TokenAmount amount={withdrawAmountB} logo={currencyB.logo} />,
          //         },
          //         { label: t`Principal ID`, value: shorten(principal?.toString() ?? "", 6) },
          //       ],
          //       skipError: withdrawAmountBLessThanZero
          //         ? t`The amount of withdrawal is less than the transfer fee`
          //         : undefined,
          //       errorActions: [
          //         <TextButton onClick={handleReclaim}>
          //           <Trans>Reclaim</Trans>
          //         </TextButton>,
          //       ],
          //       errorMessage: t`Please check your balance in the Swap Pool to see if tokens have been transferred to the Swap Pool.`,
          //     }
          //   : undefined,
        ]
      : [];

  return contents.filter((e) => !!e) as StepContents[];
}
