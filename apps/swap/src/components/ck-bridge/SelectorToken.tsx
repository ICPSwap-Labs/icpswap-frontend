import { BridgeChainType } from "@icpswap/constants";
import type { Token } from "@icpswap/swap-sdk";
import type { ChainKeyETHMinterInfo, Null } from "@icpswap/types";
import {
  BigNumber,
  formatAmount,
  formatDollarAmount,
  isValidPrincipal,
  nonUndefinedOrNull,
  parseTokenAmount,
} from "@icpswap/utils";
import { TokenImageWithChain } from "components/ck-bridge/ChainImage";
import { DotLoading, Flex } from "components/index";
import { Box, Typography, useMediaQuery, useTheme } from "components/Mui";
import { useToken } from "hooks/index";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useUSDPriceById } from "hooks/useUSDPrice";
import { useERC20Balance, useETHBalance } from "hooks/web3/index";
import { useCallback, useEffect, useMemo } from "react";
import { useAccountPrincipal } from "store/auth/hooks";

interface SelectorTokenUIProps {
  onClick?: (token: Token, chain: BridgeChainType) => void;
  hidden?: boolean;
  chain: BridgeChainType;
  balance?: BigNumber | string | Null;
  priceUSD: number | undefined;
  token: Token | Null;
  loading: boolean;
}

export function SelectorTokenUI({ onClick, hidden, chain, balance, priceUSD, token, loading }: SelectorTokenUIProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const tokenBalanceAmount = useMemo(() => {
    if (!token || balance === undefined) return undefined;
    return parseTokenAmount(balance, token.decimals).toString();
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
                {chain !== BridgeChainType.icp ? token?.symbol.replace("ck", "") : token?.symbol}
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
                {tokenBalanceAmount ? formatAmount(tokenBalanceAmount) : "--"}
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
                {priceUSD !== undefined && nonUndefinedOrNull(balance) && nonUndefinedOrNull(token)
                  ? formatDollarAmount(
                      new BigNumber(priceUSD).multipliedBy(parseTokenAmount(balance, token.decimals)).toString(),
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
  chain: BridgeChainType;
  token: Token | Null;
  hidden?: boolean;
  onClick?: (token: Token, chain: BridgeChainType) => void;
  priceUSD: number | undefined;
}

function SelectorTokenForToken({ token, onClick, hidden, chain, priceUSD }: SelectorTokenForTokenProps) {
  const principal = useAccountPrincipal();
  const { result: balance, loading } = useTokenBalance({ tokenId: token?.address, account: principal });

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
  onClick?: (token: Token, chain: BridgeChainType) => void;
  hidden?: boolean;
  chain: BridgeChainType;
  token: Token | Null;
  minterInfo: ChainKeyETHMinterInfo | Null;
  priceUSD: number | undefined;
}

function SelectorTokenForErc20Token({
  token,
  onClick,
  hidden,
  chain,
  minterInfo,
  priceUSD,
}: SelectorTokenForErc20TokenProps) {
  const ChainKeyETHMinterInfo = useMemo(() => {
    if (!token) return undefined;

    const ChainKeyETHMinterInfo = minterInfo?.supported_ckerc20_tokens[0]?.find(
      (minterInfo) => minterInfo.ledger_canister_id.toString() === token.address,
    );

    return ChainKeyETHMinterInfo;
  }, [minterInfo, token]);

  const { result: balance, loading } = useERC20Balance(ChainKeyETHMinterInfo?.erc20_contract_address);

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
  onClick?: (token: Token, chain: BridgeChainType) => void;
  hidden?: boolean;
  chain: BridgeChainType;
  token: Token | Null;
  priceUSD: number | undefined;
}

function SelectorTokenForEth({ token, onClick, hidden, chain, priceUSD }: SelectorTokenForEthProps) {
  const { result: balance, loading } = useETHBalance();

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

interface TokenSelectorNoneBalanceProps {
  onClick?: (token: Token, chain: BridgeChainType) => void;
  hidden?: boolean;
  chain: BridgeChainType;
  token: Token | Null;
  priceUSD: number | undefined;
}

export const TokenSelectorNoneBalance = ({
  token,
  onClick,
  hidden,
  chain,
  priceUSD,
}: TokenSelectorNoneBalanceProps) => {
  return (
    <SelectorTokenUI
      token={token}
      loading={false}
      hidden={hidden}
      onClick={onClick}
      chain={chain}
      priceUSD={priceUSD}
    />
  );
};

export interface SelectorTokenProps {
  tokenId: string;
  onClick?: (token: Token, chain: BridgeChainType) => void;
  searchWord?: string;
  hidden?: boolean;
  chain: BridgeChainType;
  minterInfo: ChainKeyETHMinterInfo | Null;
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
    const symbol = chain !== BridgeChainType.icp ? token.symbol.replace("ck", "") : token.symbol;
    return !symbol.toLocaleLowerCase().includes(searchWord.toLocaleLowerCase());
  }, [searchWord, token, hidden]);

  useEffect(() => {
    updateTokenHide(tokenId, isHidden);
  }, [updateTokenHide, tokenId, isHidden]);

  const priceUSD = useUSDPriceById(token?.address);

  return chain === BridgeChainType.btc ? (
    <TokenSelectorNoneBalance hidden={isHidden} onClick={onClick} chain={chain} token={token} priceUSD={priceUSD} />
  ) : chain === BridgeChainType.eth ? (
    <SelectorTokenForEth hidden={isHidden} onClick={onClick} chain={chain} token={token} priceUSD={priceUSD} />
  ) : chain === BridgeChainType.erc20 ? (
    <SelectorTokenForErc20Token
      hidden={isHidden}
      onClick={onClick}
      chain={chain}
      token={token}
      minterInfo={minterInfo}
      priceUSD={priceUSD}
    />
  ) : chain === BridgeChainType.doge ? (
    <TokenSelectorNoneBalance hidden={isHidden} onClick={onClick} chain={chain} token={token} priceUSD={priceUSD} />
  ) : (
    <SelectorTokenForToken hidden={isHidden} onClick={onClick} chain={chain} token={token} priceUSD={priceUSD} />
  );
}
