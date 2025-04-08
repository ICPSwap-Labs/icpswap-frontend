import { Box, Avatar } from "components/Mui";
import { Token, CurrencyAmount } from "@icpswap/swap-sdk";
import { TextButton } from "components/index";
import { Principal } from "@dfinity/principal";
import i18n from "i18n/index";

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

export function getCollectFeeSteps({ positionId, retry, currencyFeeAmount0, currencyFeeAmount1 }: CollectStepsProps) {
  const withdrawAmountA = currencyFeeAmount0.toSignificant(12, { groupSeparator: "," });
  const withdrawAmountB = currencyFeeAmount1.toSignificant(12, { groupSeparator: "," });

  const tokenA = currencyFeeAmount0.currency.wrapped;
  const tokenB = currencyFeeAmount1.currency.wrapped;

  return [
    {
      title: i18n.t("swap.collect.tokens", { symbol0: tokenA.symbol, symbol1: tokenB.symbol }),
      step: 0,
      children: [
        { label: i18n.t("common.position.id"), value: positionId.toString() },
        {
          label: i18n.t`Token0`,
          value: <TokenAmount amount={withdrawAmountA} logo={tokenA.logo} />,
        },
        {
          label: i18n.t`Token1`,
          value: <TokenAmount amount={withdrawAmountB} logo={tokenB.logo} />,
        },
      ],
      errorActions: [<TextButton onClick={retry}>{i18n.t("common.retry")}</TextButton>],
    },
  ];
}
