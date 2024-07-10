import { Box, Avatar } from "@mui/material";
import { parseTokenAmount } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { t } from "@lingui/macro";
import { toFormat } from "utils/index";
import { isUseTransfer, actualAmountToPool } from "utils/token/index";

export interface GetSteps {
  token: Token;
  amount: string | number;
  retry?: () => void;
}

export function getSteps({ token, amount }: GetSteps) {
  const amount0 = toFormat(parseTokenAmount(actualAmountToPool(token, String(amount)), token.decimals).toString());

  const amount0Value = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar sx={{ width: "16px", height: "16px", margin: "0 4px 0 0" }} src={token.logo}>
        &nbsp;
      </Avatar>
      {amount0}
    </Box>
  );

  const steps: any[] = [
    {
      title: isUseTransfer(token) ? `Transfer ${token.symbol}` : `Approve ${token.symbol}`,
      children: [
        { label: t`Amount`, value: amount0Value },
        { label: t`Canister Id`, value: token.address },
      ],
    },
    {
      title: t`Deposit ${token.symbol}`,
      children: [
        {
          label: t`Amount`,
          value: amount0Value,
        },
        { label: t`Canister Id`, value: token.address },
      ],
    },
  ];

  return steps.filter((step) => step !== undefined).map((step, index) => ({ ...step, step: index }));
}
