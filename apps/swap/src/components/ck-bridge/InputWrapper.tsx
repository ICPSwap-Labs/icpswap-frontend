import { Trans } from "@lingui/macro";
import { NumberTextField, MaxButton } from "components/index";
import { Box, Typography, useTheme } from "components/Mui";
import { useCallback } from "react";
import { Null } from "@icpswap/types";
import { Flex } from "@icpswap/ui";
import { ckBridgeChain } from "@icpswap/constants";
import { Token } from "@icpswap/swap-sdk";
import { BigNumber, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { useTokenSymbol } from "hooks/ck-bridge";

import { TokenImageWithChain } from "./ChainImage";

export interface InputWrapperProps {
  token: Token | Null;
  chain: ckBridgeChain | Null;
  balance: BigNumber | Null;
  onInput: (value: string) => void;
  onMax: () => void;
  value: string | Null;
}

export function InputWrapper({ value, token, balance, chain, onInput, onMax }: InputWrapperProps) {
  const theme = useTheme();

  const symbol = useTokenSymbol({ token, bridgeChain: chain });

  const handleInput = useCallback(
    (value: string) => {
      onInput(value);
    },
    [onInput],
  );

  return (
    <Box
      sx={{
        width: "100%",
        padding: "20px 16px",
        background: theme.palette.background.level3,
        border: `1px solid ${theme.palette.background.level4}`,
        borderRadius: "16px",
      }}
    >
      <Flex>
        <NumberTextField
          value={value === null ? "" : value}
          onChange={(e) => handleInput(e.target.value)}
          fullWidth
          sx={{
            "& input": {
              fontSize: "24px!important",
              fontWeight: 500,
            },
            "& input::placeholder": {
              fontSize: "24px",
              fontWeight: 500,
            },
          }}
          placeholder="0.0"
          variant="standard"
          numericProps={{
            thousandSeparator: true,
            decimalScale: 8,
            allowNegative: false,
            maxLength: 70,
          }}
        />

        {token ? (
          <Flex gap="0 4px">
            <TokenImageWithChain token={token} chain={chain} size="28px" />
            <Typography sx={{ fontSize: "18px", color: "text.primary" }}>{symbol ?? "--"}</Typography>
          </Flex>
        ) : null}
      </Flex>

      <Flex justify="flex-end" gap="0 6px">
        <Typography>
          <Trans>Balance:</Trans>&nbsp;
          {balance && token
            ? toSignificantWithGroupSeparator(parseTokenAmount(balance, token.decimals).toString())
            : "--"}
        </Typography>

        <MaxButton onClick={onMax} />
      </Flex>
    </Box>
  );
}
