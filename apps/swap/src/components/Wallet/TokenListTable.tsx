import { useState, useMemo, useEffect, useCallback } from "react";
import { Typography, Box, useTheme, makeStyles } from "components/Mui";
import {
  formatDollarAmount,
  formatDollarTokenPrice,
  parseTokenAmount,
  mockALinkAndOpen,
  BigNumber,
  principalToAccount,
  nonUndefinedOrNull,
  isUndefinedOrNull,
  formatAmount,
} from "@icpswap/utils";
import { NoData, LoadingRow, TokenStandardLabel, TokenTransferModal, ImportToNns } from "components/index";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { NO_HIDDEN_TOKENS, INFO_URL, DISPLAY_IN_WALLET_BY_DEFAULT } from "constants/index";
import { useToken } from "hooks/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { XTC, TOKEN_STANDARD } from "constants/tokens";
import { ICP, WRAPPED_ICP, ckBTC, ckETH } from "@icpswap/tokens";
import { ckBridgeChain } from "@icpswap/constants";
import { XTCTopUpModal } from "components/Wallet/XTCTopUpModal";
import { useNavigate } from "react-router-dom";
import { TokenImage } from "components/Image/Token";
import { useSNSTokenRootId } from "hooks/token/useSNSTokenRootId";
import { ChainKeyETHMinterInfo } from "@icpswap/types";
import { useInfoToken } from "@icpswap/hooks";
import { useSortBalanceManager } from "store/wallet/hooks";
import { SortBalanceEnum } from "types/index";
import { Token } from "@icpswap/swap-sdk";
import { useTranslation } from "react-i18next";
import { useWalletTokenContext } from "components/Wallet/token/context";

import { ReceiveModal } from "./Receive";
import { RemoveToken } from "./RemoveToken";
import { Button } from "./Button";
import { TransactionButton } from "./TransactionButton";

const useStyles = makeStyles(() => ({
  tokenAssets: {
    fontSize: "0.6rem",
  },
  walletSymbol: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  dot: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "#8492C4",
  },
}));

type ckTOKEN = {
  id: string;
  mintPath: string;
  dissolvePath: string;
};

const ckTokens: ckTOKEN[] = [
  {
    id: ckBTC.address,
    mintPath: `/ck-bridge?tokenId=${ckBTC.address}&chain=${ckBridgeChain.btc}`,
    dissolvePath: `/ck-bridge?tokenId=${ckBTC.address}&chain=${ckBridgeChain.icp}`,
  },
  {
    id: ckETH.address,
    mintPath: `/ck-bridge?tokenId=${ckETH.address}&chain=${ckBridgeChain.eth}`,
    dissolvePath: `/ck-bridge?tokenId=${ckETH.address}&chain=${ckBridgeChain.icp}`,
  },
];

function ChainKeyTokenButtons({ ckToken }: { ckToken: ckTOKEN }) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleCKTokenMint = (path: string) => {
    navigate(path);
  };

  const handleCKTokenDissolve = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <Button label={t("common.mint")} onClick={() => handleCKTokenMint(ckToken.mintPath)} />
      <Button label={t("common.dissolve")} onClick={() => handleCKTokenDissolve(ckToken.dissolvePath)} />
    </>
  );
}

const SWAP_BUTTON_EXCLUDE = [ICP.address, WRAPPED_ICP.address];

let COUNTER = 0;
const TOKEN_BALANCE_INTERVAL = 60000;

export interface TokenListItemProps {
  canisterId: string;
  chainKeyMinterInfo: ChainKeyETHMinterInfo | undefined;
}

export function TokenRow({ canisterId, chainKeyMinterInfo }: TokenListItemProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();
  const principal = useAccountPrincipal();

  const [XTCTopUpShow, setXTCTopUpShow] = useState(false);
  const [refreshInnerCounter, setRefreshInnerCounter] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const { refreshCounter, setTotalValue, setTotalUSDBeforeChange, setNoUSDTokens } = useWalletTokenContext();
  const { sortBalance } = useSortBalanceManager();

  const infoTokenAddress = useMemo(() => {
    if (canisterId === WRAPPED_ICP.address) return ICP.address;
    return canisterId;
  }, [canisterId]);

  const refreshNumber = useMemo(() => {
    return refreshInnerCounter + refreshCounter;
  }, [refreshInnerCounter, refreshCounter]);

  const infoToken = useInfoToken(infoTokenAddress);
  const [, token] = useToken(canisterId);
  const { result: tokenBalance, loading: tokenBalanceLoading } = useTokenBalance(canisterId, principal, refreshNumber);
  const tokenUSDPrice = useMemo(() => {
    return infoToken?.price;
  }, [infoToken]);

  const handleIncreaseCounter = useCallback(() => {
    setRefreshInnerCounter(COUNTER + 1);
    COUNTER += 1;
  }, [setRefreshInnerCounter]);

  // Interval update user's token balance
  useEffect(() => {
    let timer: number | null = setInterval(() => {
      handleIncreaseCounter();
    }, TOKEN_BALANCE_INTERVAL);

    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, [handleIncreaseCounter]);

  useEffect(() => {
    if (token && token.decimals !== undefined && token.transFee !== undefined && tokenBalance && infoToken) {
      setTotalValue(token.address, parseTokenAmount(tokenBalance, token.decimals).multipliedBy(infoToken.price));

      const usdBeforeChange = new BigNumber(infoToken.price).div(
        new BigNumber(infoToken.priceChange24H).dividedBy(100).plus(1),
      );

      setTotalUSDBeforeChange(
        token.address,
        parseTokenAmount(tokenBalance, token.decimals).multipliedBy(usdBeforeChange),
      );
    }
  }, [tokenBalance, infoToken, token, tokenUSDPrice]);

  useEffect(() => {
    if (
      token &&
      token.decimals !== undefined &&
      token.transFee !== undefined &&
      tokenBalance &&
      tokenBalanceLoading === false &&
      !infoToken
    ) {
      setNoUSDTokens(token.address);
    }
  }, [token, tokenBalance, tokenBalanceLoading, infoToken]);

  const allSupportedErc20Tokens = useMemo(() => {
    if (!chainKeyMinterInfo) return ckTokens;
    if (!chainKeyMinterInfo.supported_ckerc20_tokens[0]) return ckTokens;
    if (chainKeyMinterInfo.supported_ckerc20_tokens[0].length === 0) return ckTokens;

    return ckTokens.concat(
      chainKeyMinterInfo.supported_ckerc20_tokens[0].map((token) => {
        const ledger_id = token.ledger_canister_id.toString();

        return {
          id: ledger_id,
          mintPath: `/ck-bridge?chain=${ckBridgeChain.eth}&tokenId=${ledger_id}`,
          dissolvePath: `/ck-bridge?chain=${ckBridgeChain.icp}&tokenId=${ledger_id}`,
        };
      }),
    );
  }, [ckTokens, chainKeyMinterInfo]);

  const handleCloseModal = async () => {
    setOpen(false);
  };

  const handleTransferSuccess = () => {
    handleIncreaseCounter();
    handleCloseModal();
  };

  const handleTopUpSuccess = () => {
    handleIncreaseCounter();
  };

  const handleTransfer = async () => {
    setOpen(true);
  };

  const root_canister_id = useSNSTokenRootId(canisterId);

  const isBridgeToken = useMemo(() => {
    if (!token) return false;
    return !!allSupportedErc20Tokens.find((e) => e.id === token.address);
  }, [allSupportedErc20Tokens, token]);

  const handleLoadToDetail = (token: Token | undefined) => {
    if (token && token.symbol !== ICP.symbol) {
      mockALinkAndOpen(`${INFO_URL}/info-tokens/details/${token.address}?standard=${token?.standard}`, "TOKEN_DETAILs");
    }
  };

  const handleXTCTopUp = () => {
    setXTCTopUpShow(true);
  };

  const handleWrappedICP = (value: "wrap" | "unwrap") => {
    if (value === "wrap") {
      navigate("/swap/v2/wrap?input=icp");
      return;
    }

    navigate("/swap/v2/wrap?input=wicp");
  };

  const isHidden = useMemo(() => {
    let hiddenBySmallBalance = false;

    if (isUndefinedOrNull(tokenBalance)) return false;

    if (nonUndefinedOrNull(token)) {
      if (new BigNumber(tokenBalance).isEqualTo(0)) {
        hiddenBySmallBalance = sortBalance !== SortBalanceEnum.ALL;
      } else if (nonUndefinedOrNull(tokenUSDPrice)) {
        const tokenUSDValue = parseTokenAmount(tokenBalance, token.decimals).multipliedBy(tokenUSDPrice);

        if (sortBalance === SortBalanceEnum.TEN) {
          hiddenBySmallBalance = tokenUSDValue.isLessThan(10);
        } else if (sortBalance === SortBalanceEnum.ONE) {
          hiddenBySmallBalance = tokenUSDValue.isLessThan(1);
        } else if (sortBalance === SortBalanceEnum.ZERO) {
          hiddenBySmallBalance = tokenUSDValue.isEqualTo(0);
        }
      }
    }

    if (NO_HIDDEN_TOKENS.includes(canisterId)) return false;

    return hiddenBySmallBalance;
  }, [sortBalance, tokenBalance, canisterId, token, tokenUSDPrice]);

  const handleToSwap = () => {
    navigate(`/swap?input=${canisterId}&output=${ICP.address}`);
  };

  const handleReceive = () => {
    setReceiveOpen(true);
  };

  return (
    <Box
      sx={{
        borderRadius: "12px",
        background: theme.palette.background.level4,
        padding: "20px",
        maxWidth: "100%",
        overflow: "hidden",
        ...(isHidden ? { display: "none" } : {}),
        "@media(max-width: 640px)": {
          padding: "10px",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", gap: "0 10px", alignItems: "center" }}>
          <TokenImage size="40px" logo={token?.logo} tokenId={token?.address} />
          <Box>
            <Typography
              color="textPrimary"
              className={token?.symbol !== ICP.symbol ? classes.walletSymbol : ""}
              onClick={() => handleLoadToDetail(token)}
              fontWeight={500}
            >
              {token?.symbol}
            </Typography>
            <Typography sx={{ fontSize: "12px" }}>{token?.name}</Typography>
          </Box>
        </Box>
        <TokenStandardLabel standard={token && token.standard ? (token.standard as TOKEN_STANDARD) : null} />
      </Box>

      <Box sx={{ display: "flex", margin: "12px 0 0 0" }}>
        <Box sx={{ width: "50%" }}>
          <Typography fontSize="12px">Balance</Typography>
          <Typography color="textPrimary" sx={{ margin: "6px 0 0 0" }}>
            {nonUndefinedOrNull(tokenBalance) && token
              ? formatAmount(parseTokenAmount(tokenBalance, token.decimals).toString())
              : "--"}
          </Typography>
          <Typography className={classes.tokenAssets} sx={{ margin: "4px 0 0 0" }}>
            {nonUndefinedOrNull(tokenUSDPrice) && nonUndefinedOrNull(tokenBalance) && token
              ? `≈
              ${formatDollarAmount(
                parseTokenAmount(tokenBalance, token.decimals).multipliedBy(tokenUSDPrice).toString(),
              )}`
              : "--"}
          </Typography>
        </Box>
        <Box sx={{ width: "50%" }}>
          <Typography fontSize="12px">Price</Typography>
          <Typography color="textPrimary" sx={{ margin: "6px 0 0 0" }}>
            {tokenUSDPrice ? formatDollarTokenPrice(tokenUSDPrice) : "--"}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ margin: "24px 0 0 0", display: "flex", justifyContent: "space-between", gap: "0 5px" }}>
        {DISPLAY_IN_WALLET_BY_DEFAULT.includes(canisterId) ? null : <RemoveToken canisterId={canisterId} />}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
          {SWAP_BUTTON_EXCLUDE.includes(canisterId) ? null : <Button label="Swap" onClick={handleToSwap} />}

          <Button label="Send" onClick={handleTransfer} />
          <Button label="Receive" onClick={handleReceive} />

          <ImportToNns tokenId={canisterId}>
            <Button label={t("common.nns.token.add")} />
          </ImportToNns>

          <TransactionButton
            tokenId={canisterId}
            principal={principal?.toString()}
            snsRootId={root_canister_id}
            isBridgeToken={isBridgeToken}
          />

          {token?.address === XTC.address ? <Button label={t("common.topup")} onClick={handleXTCTopUp} /> : null}

          {token?.address === WRAPPED_ICP.address ? (
            <>
              <Button label={t`Unwrap`} onClick={() => handleWrappedICP("unwrap")} />
              <Button label={t`Wrap`} onClick={() => handleWrappedICP("wrap")} />
            </>
          ) : null}

          {allSupportedErc20Tokens
            .filter((ele) => ele.id === token?.address)
            .map((ele) => (
              <ChainKeyTokenButtons key={ele.id} ckToken={ele} />
            ))}
        </Box>
      </Box>

      {open && !!token ? (
        <TokenTransferModal
          open={open}
          onClose={handleCloseModal}
          token={token}
          onTransferSuccess={handleTransferSuccess}
        />
      ) : null}

      {XTCTopUpShow ? (
        <XTCTopUpModal open={XTCTopUpShow} onClose={() => setXTCTopUpShow(false)} onTopUpSuccess={handleTopUpSuccess} />
      ) : null}

      {receiveOpen ? (
        <ReceiveModal
          open={receiveOpen}
          onClose={() => setReceiveOpen(false)}
          address={
            !principal
              ? ""
              : token?.standard === TOKEN_STANDARD.EXT || token?.address === ICP.address
              ? principalToAccount(principal.toString())
              : principal.toString()
          }
        />
      ) : null}
    </Box>
  );
}

export interface TokenListProps {
  tokens: string[];
  loading?: boolean;
  chainKeyMinterInfo: ChainKeyETHMinterInfo | undefined;
}

export default function Tokens({ tokens, loading, chainKeyMinterInfo }: TokenListProps) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "20px",
        "@media(max-width: 1088px)": {
          gridTemplateColumns: "1fr 1fr",
          gap: "12px 12px",
        },
        "@media(max-width: 640px)": {
          gridTemplateColumns: "1fr",
          gap: "12px 0",
        },
      }}
    >
      {tokens.map((canisterId) => {
        return <TokenRow key={canisterId} canisterId={canisterId} chainKeyMinterInfo={chainKeyMinterInfo} />;
      })}

      {tokens.length === 0 && !loading ? <NoData /> : null}

      {loading ? (
        <LoadingRow>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </LoadingRow>
      ) : null}
    </Box>
  );
}
