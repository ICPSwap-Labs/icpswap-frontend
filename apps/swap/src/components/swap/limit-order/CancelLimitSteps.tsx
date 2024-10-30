import { toSignificant, parseTokenAmount, BigNumber, shorten } from "@icpswap/utils";
import { Position, Token } from "@icpswap/swap-sdk";
import { t, Trans } from "@lingui/macro";
import { Flex, TextButton, TokenImage } from "components/index";
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

interface TokenAmountProps {
  amount: string | undefined;
  token: Token;
}

function TokenAmount({ token, amount }: TokenAmountProps) {
  return (
    <Flex gap="0 4px">
      <TokenImage size="16px" logo={token.logo} tokenId={token.address} />
      {amount ?? "--"}
    </Flex>
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

  const contents = [
    {
      title: t`Confirm Cancellation`,
      step: 0,
      children: [
        { label: t`Position ID`, value: positionId.toString() },
        {
          label: `${token.symbol}`,
          value: <TokenAmount amount={toFormat(withdrawAmount)} token={token} />,
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
              value: <TokenAmount amount={withdrawAmount} token={token} />,
            },
            { label: t`Principal ID`, value: shorten(principal?.toString() ?? "", 6) },
          ],
          skipError: withdrawAmountLessThanZero ? t`The amount of withdrawal is less than the transfer fee` : undefined,
          errorActions: [
            <TextButton onClick={handleReclaim}>
              <Trans>Reclaim</Trans>
            </TextButton>,
          ],
          errorMessage: t`Please check your balance in the Swap Pool to see if tokens have been transferred to the Swap Pool.`,
        }
      : null,
  ];

  return contents.filter((e) => !!e) as StepContents[];
}
