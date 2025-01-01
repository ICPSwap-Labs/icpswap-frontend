import { Flex } from "@icpswap/ui";
import { Token } from "@icpswap/swap-sdk";
import { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import { Trans } from "@lingui/macro";
import { Box, Typography } from "components/Mui";
import { LinkButtons, LastSyncBlock, EthereumFinalizedBlock } from "components/ck-bridge";
import { useMemo } from "react";

export interface Erc20NetworkStateProps {
  token: Token;
  minterInfo?: ChainKeyETHMinterInfo | Null;
}

export function Erc20NetworkState({ token, minterInfo }: Erc20NetworkStateProps) {
  const tokenMinterInfo = useMemo(() => {
    if (!minterInfo) return undefined;
    return minterInfo.supported_ckerc20_tokens[0]?.find((e) => e.ledger_canister_id.toString() === token.address);
  }, [minterInfo, token]);

  return (
    <Flex vertical gap="12px 0" align="flex-start" sx={{ margin: "16px 0 0 0" }}>
      <Typography sx={{ color: "text.primary", fontSize: "12px" }}>
        <Trans>Network State</Trans>
      </Typography>

      <LinkButtons ckToken={token} contract={tokenMinterInfo?.erc20_contract_address} />

      <Box>
        <EthereumFinalizedBlock />
        {minterInfo ? (
          <Box sx={{ margin: "8px 0 0 0" }}>
            <LastSyncBlock minterInfo={minterInfo} />
          </Box>
        ) : null}
      </Box>
    </Flex>
  );
}
