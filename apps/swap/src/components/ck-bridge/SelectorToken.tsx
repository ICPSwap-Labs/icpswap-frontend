import { useCallback, useEffect, useMemo } from "react";
import { useTheme, Typography, Box, useMediaQuery } from "components/Mui";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useERC20Balance, useETHBalance } from "hooks/web3/index";
import { DotLoading, Flex } from "components/index";
import { ckBridgeChain } from "@icpswap/constants";
import { useAccountPrincipal } from "store/auth/hooks";
import { useUSDPriceById } from "hooks/useUSDPrice";
import {
  parseTokenAmount,
  formatDollarAmount,
  BigNumber,
  isValidPrincipal,
  toSignificantWithGroupSeparator,
  nonNullArgs,
} from "@icpswap/utils";
import { useToken } from "hooks/index";
import { Erc20MinterInfo, Null } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";
import { ckBTC, ckETH } from "@icpswap/tokens";

import { TokenImageWithChain } from "./ChainImage";

interface SelectorTokenUIProps {
  onClick?: (token: Token, chain: ckBridgeChain) => void;
  hidden?: boolean;
  chain: ckBridgeChain;
  balance: BigNumber | string | Null;
  priceUSD: number | undefined;
  token: Token | Null;
  loading: boolean;
}

export function SelectorTokenUI({ onClick, hidden, chain, balance, priceUSD, token, loading }: SelectorTokenUIProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const tokenBalanceAmount = useMemo(() => {
    if (!token || balance === undefined) return undefined;
    return toSignificantWithGroupSeparator(parseTokenAmount(balance, token.decimals).toString(), 6);
  }, [token, balance]);

  const handleClick = useCallback(() => {
    if (onClick && token) onClick(token, chain);
  }, [onClick, token, chain]);

  return (
    <Box
      sx={{
        display: hidden ? "none" : "grid",
        height: "64px",
        cursor: "pointer",
        padding: matchDownSM ? "0 16px" : "0 24px",
        gridTemplateColumns: "198px 1fr",
        gap: "0 5px",
        alignItems: "center",
        "&.disabled": {
          opacity: 0.5,
          cursor: "default",
        },
        "&.active": {
          background: theme.palette.background.level4,
          cursor: "default",
        },
        "&:hover": {
          background: theme.palette.background.level4,
        },
        "@media (max-width: 580px)": {
          gridTemplateColumns: "115px 1fr",
        },
      }}
      onClick={handleClick}
    >
      <Box>
        <Flex gap="0 12px">
          <TokenImageWithChain token={token} chain={chain} />

          <Flex sx={{ overflow: "hidden" }}>
            <Box sx={{ width: "100%" }}>
              <Typography
                color="text.primary"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "16px",
                  fontWeight: 500,
                  "@media (max-width: 580px)": {
                    fontSize: "14px",
                  },
                }}
              >
                {chain !== ckBridgeChain.icp ? token?.symbol.replace("ck", "") : token?.symbol}
              </Typography>
              <Typography
                fontSize="12px"
                sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: "4px 0 0 0" }}
              >
                {chain}
              </Typography>
            </Box>
          </Flex>
        </Flex>
      </Box>

      <Box>
        <Flex fullWidth justify="flex-end">
          {loading ? (
            <DotLoading loading />
          ) : (
            <Box>
              <Typography
                color="text.primary"
                align="right"
                sx={{
                  maxWidth: "10rem",
                  fontSize: "16px",
                  "@media (max-width: 580px)": {
                    fontSize: "14px",
                  },
                }}
                fontWeight={500}
              >
                {tokenBalanceAmount ?? "--"}
              </Typography>
              <Typography
                align="right"
                sx={{
                  margin: "4px 0 0 0",
                  "@media (max-width: 580px)": {
                    fontSize: "12px",
                  },
                }}
              >
                {priceUSD !== undefined && nonNullArgs(balance) && nonNullArgs(token)
                  ? formatDollarAmount(
                      new BigNumber(priceUSD).multipliedBy(parseTokenAmount(balance, token.decimals)).toString(),
                      4,
                      true,
                      0.001,
                    )
                  : "--"}
              </Typography>
            </Box>
          )}
        </Flex>
      </Box>
    </Box>
  );
}

interface SelectorTokenForTokenProps {
  chain: ckBridgeChain;
  token: Token | Null;
  hidden?: boolean;
  onClick?: (token: Token, chain: ckBridgeChain) => void;
}

function SelectorTokenForToken({ token, onClick, hidden, chain }: SelectorTokenForTokenProps) {
  const principal = useAccountPrincipal();
  const { result: balance, loading } = useTokenBalance(token?.address, principal);

  const priceUSD = useUSDPriceById(token?.address);

  return (
    <SelectorTokenUI
      token={token}
      loading={loading}
      hidden={hidden}
      onClick={onClick}
      chain={chain}
      priceUSD={priceUSD}
      balance={balance}
    />
  );
}

interface SelectorTokenForErc20TokenProps {
  onClick?: (token: Token, chain: ckBridgeChain) => void;
  hidden?: boolean;
  chain: ckBridgeChain;
  token: Token | Null;
  minterInfo: Erc20MinterInfo | Null;
}

function SelectorTokenForErc20Token({ token, onClick, hidden, chain, minterInfo }: SelectorTokenForErc20TokenProps) {
  const erc20MinterInfo = useMemo(() => {
    if (!token) return undefined;

    const erc20MinterInfo = minterInfo?.supported_ckerc20_tokens[0]?.find(
      (minterInfo) => minterInfo.ledger_canister_id.toString() === token.address,
    );

    return erc20MinterInfo;
  }, [minterInfo, token]);

  const { result: balance, loading } = useERC20Balance(erc20MinterInfo?.erc20_contract_address);

  const priceUSD = useUSDPriceById(token?.address);

  return (
    <SelectorTokenUI
      token={token}
      loading={loading}
      hidden={hidden}
      onClick={onClick}
      chain={chain}
      priceUSD={priceUSD}
      balance={balance}
    />
  );
}

interface SelectorTokenForEthProps {
  onClick?: (token: Token, chain: ckBridgeChain) => void;
  hidden?: boolean;
  chain: ckBridgeChain;
  token: Token | Null;
}

function SelectorTokenForEth({ token, onClick, hidden, chain }: SelectorTokenForEthProps) {
  const { result: balance, loading } = useETHBalance();

  const priceUSD = useUSDPriceById(token?.address);

  return (
    <SelectorTokenUI
      token={token}
      loading={loading}
      hidden={hidden}
      onClick={onClick}
      chain={chain}
      priceUSD={priceUSD}
      balance={balance}
    />
  );
}

interface SelectorTokenForBtcProps {
  onClick?: (token: Token, chain: ckBridgeChain) => void;
  hidden?: boolean;
  chain: ckBridgeChain;
  token: Token | Null;
}

function SelectorTokenForBtc({ token, onClick, hidden, chain }: SelectorTokenForBtcProps) {
  const balance = undefined;
  const priceUSD = useUSDPriceById(token?.address);

  return (
    <SelectorTokenUI
      token={token}
      loading={false}
      hidden={hidden}
      onClick={onClick}
      chain={chain}
      priceUSD={priceUSD}
      balance={balance}
    />
  );
}

export interface SelectorTokenProps {
  tokenId: string;
  onClick?: (token: Token, chain: ckBridgeChain) => void;
  searchWord?: string;
  hidden?: boolean;
  chain: ckBridgeChain;
  minterInfo: Erc20MinterInfo | Null;
  updateTokenHide: (tokenId: string, hidden: boolean) => void;
}

export function SelectorToken({
  tokenId,
  onClick,
  searchWord,
  hidden,
  chain,
  minterInfo,
  updateTokenHide,
}: SelectorTokenProps) {
  const [, token] = useToken(tokenId);

  const isHidden = useMemo(() => {
    if (hidden) return true;
    if (!searchWord) return false;
    if (!token) return true;

    if (isValidPrincipal(searchWord)) return token?.address.toString() !== searchWord;
    const symbol = chain !== ckBridgeChain.icp ? token.symbol.replace("ck", "") : token.symbol;
    return !symbol.toLocaleLowerCase().includes(searchWord.toLocaleLowerCase());
  }, [searchWord, token, hidden]);

  useEffect(() => {
    updateTokenHide(tokenId, isHidden);
  }, [updateTokenHide, tokenId, isHidden]);

  return tokenId === ckBTC.address && chain === ckBridgeChain.btc ? (
    <SelectorTokenForBtc hidden={isHidden} onClick={onClick} chain={chain} token={token} />
  ) : tokenId === ckETH.address && chain === ckBridgeChain.eth ? (
    <SelectorTokenForEth hidden={isHidden} onClick={onClick} chain={chain} token={token} />
  ) : chain === ckBridgeChain.eth ? (
    <SelectorTokenForErc20Token
      hidden={isHidden}
      onClick={onClick}
      chain={chain}
      token={token}
      minterInfo={minterInfo}
    />
  ) : (
    <SelectorTokenForToken hidden={isHidden} onClick={onClick} chain={chain} token={token} />
  );
}
