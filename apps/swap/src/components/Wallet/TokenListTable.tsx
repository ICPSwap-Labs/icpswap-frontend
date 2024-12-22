import { useState, useContext, useMemo, useEffect, useCallback } from "react";
import { Typography, Box, useTheme, makeStyles } from "components/Mui";
import {
  formatDollarAmount,
  formatDollarTokenPrice,
  parseTokenAmount,
  mockALinkAndOpen,
  BigNumber,
  principalToAccount,
  nonNullArgs,
  isNullArgs,
  formatAmount,
} from "@icpswap/utils";
import TransferModal from "components/TokenTransfer/index";
import { NoData, LoadingRow, TokenStandardLabel } from "components/index";
import { useStoreTokenBalance } from "hooks/token/useTokenBalance";
import { Connector, NO_HIDDEN_TOKENS, INFO_URL, DISPLAY_IN_WALLET_FOREVER } from "constants/index";
import { t } from "@lingui/macro";
import WalletContext from "components/Wallet/context";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { TokenInfo } from "types/token";
import { useAccountPrincipal, useConnectorType } from "store/auth/hooks";
import { XTC, TOKEN_STANDARD } from "constants/tokens";
import { ICP, WRAPPED_ICP, ckBTC, ckETH } from "@icpswap/tokens";
import { ckBridgeChain } from "@icpswap/constants";
import XTCTopUpModal from "components/XTCTopup/index";
import NFIDTransfer from "components/Wallet/NFIDTransfer";
import { useHistory } from "react-router-dom";
import { TokenImage } from "components/Image/Token";
import { useSNSTokenRootId } from "hooks/token/useSNSTokenRootId";
import { Erc20MinterInfo } from "@icpswap/types";
import { useInfoToken } from "@icpswap/hooks";
import { useSortBalanceManager } from "store/wallet/hooks";
import { SortBalanceEnum } from "types/index";

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
  const history = useHistory();

  const handleCKTokenMint = (path: string) => {
    history.push(path);
  };

  const handleCKTokenDissolve = (path: string) => {
    history.push(path);
  };

  return (
    <>
      <Button label={t`Mint`} onClick={() => handleCKTokenMint(ckToken.mintPath)} />
      <Button label={t`Dissolve`} onClick={() => handleCKTokenDissolve(ckToken.dissolvePath)} />
    </>
  );
}

const SWAP_BUTTON_EXCLUDE = [ICP.address, WRAPPED_ICP.address];

let COUNTER = 0;
const TOKEN_BALANCE_INTERVAL = 60000;

export interface TokenListItemProps {
  canisterId: string;
  chainKeyMinterInfo: Erc20MinterInfo | undefined;
}

export function Token({ canisterId, chainKeyMinterInfo }: TokenListItemProps) {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const principal = useAccountPrincipal();
  const walletType = useConnectorType();

  const [XTCTopUpShow, setXTCTopUpShow] = useState(false);
  const [refreshInnerCounter, setRefreshInnerCounter] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [NFIDTransferOpen, setNFIDTransferOpen] = useState(false);
  const { refreshCounter, setTotalValue, setTotalUSDBeforeChange, setNoUSDTokens } = useContext(WalletContext);
  const { sortBalance } = useSortBalanceManager();

  const infoTokenAddress = useMemo(() => {
    if (canisterId === WRAPPED_ICP.address) return ICP.address;
    return canisterId;
  }, [canisterId]);

  const refreshNumber = useMemo(() => {
    return refreshInnerCounter + refreshCounter;
  }, [refreshInnerCounter, refreshCounter]);

  const infoToken = useInfoToken(infoTokenAddress);
  const { result: tokenInfo } = useTokenInfo(canisterId);
  const { result: tokenBalance, loading: tokenBalanceLoading } = useStoreTokenBalance(
    canisterId,
    principal,
    refreshNumber,
  );
  const tokenUSDPrice = useMemo(() => {
    return infoToken?.priceUSD;
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
    if (
      tokenInfo &&
      tokenInfo.decimals !== undefined &&
      tokenInfo.transFee !== undefined &&
      tokenBalance &&
      infoToken
    ) {
      setTotalValue(
        tokenInfo.canisterId,
        parseTokenAmount(tokenBalance, tokenInfo.decimals).multipliedBy(infoToken.priceUSD),
      );

      const usdBeforeChange = new BigNumber(infoToken.priceUSD).div(
        new BigNumber(infoToken.priceUSDChange).dividedBy(100).plus(1),
      );

      setTotalUSDBeforeChange(
        tokenInfo.canisterId,
        parseTokenAmount(tokenBalance, tokenInfo.decimals).multipliedBy(usdBeforeChange),
      );
    }
  }, [tokenBalance, infoToken, tokenInfo, tokenUSDPrice]);

  useEffect(() => {
    if (
      tokenInfo &&
      tokenInfo.decimals !== undefined &&
      tokenInfo.transFee !== undefined &&
      tokenBalance &&
      tokenBalanceLoading === false &&
      !infoToken
    ) {
      setNoUSDTokens(tokenInfo.canisterId);
    }
  }, [tokenInfo, tokenBalance, tokenBalanceLoading, infoToken]);

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
    setNFIDTransferOpen(false);
  };

  const handleTopUpSuccess = () => {
    handleIncreaseCounter();
  };

  const handleTransfer = async () => {
    setOpen(true);
  };

  const root_canister_id = useSNSTokenRootId(canisterId);

  const isBridgeToken = useMemo(() => {
    if (!tokenInfo) return false;
    return !!allSupportedErc20Tokens.find((e) => e.id === tokenInfo.canisterId);
  }, [allSupportedErc20Tokens, tokenInfo]);

  const handleLoadToDetail = (tokenInfo: TokenInfo | undefined) => {
    if (tokenInfo && tokenInfo.symbol !== ICP.symbol) {
      mockALinkAndOpen(
        `${INFO_URL}/info-tokens/details/${tokenInfo?.canisterId}?standard=${tokenInfo?.standardType}`,
        "TOKEN_DETAILs",
      );
    }
  };

  const handleXTCTopUp = () => {
    setXTCTopUpShow(true);
  };

  const handleWrappedICP = (value: "wrap" | "unwrap") => {
    if (value === "wrap") {
      history.push("/swap/v2/wrap?input=icp");
      return;
    }

    history.push("/swap/v2/wrap?input=wicp");
  };

  const isHidden = useMemo(() => {
    let hiddenBySmallBalance = false;

    if (isNullArgs(tokenBalance)) return false;

    if (nonNullArgs(tokenInfo)) {
      if (tokenBalance.isEqualTo(0)) {
        hiddenBySmallBalance = sortBalance !== SortBalanceEnum.ALL;
      } else if (nonNullArgs(tokenUSDPrice)) {
        const tokenUSDValue = parseTokenAmount(tokenBalance, tokenInfo.decimals).multipliedBy(tokenUSDPrice);

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
  }, [sortBalance, tokenBalance, canisterId, tokenInfo, tokenUSDPrice]);

  const handleToSwap = () => {
    history.push(`/swap?input=${canisterId}&output=${ICP.address}`);
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
          <TokenImage size="40px" logo={tokenInfo?.logo} tokenId={tokenInfo?.canisterId} />
          <Box>
            <Typography
              color="textPrimary"
              className={tokenInfo?.symbol !== ICP.symbol ? classes.walletSymbol : ""}
              onClick={() => handleLoadToDetail(tokenInfo)}
              fontWeight={500}
            >
              {tokenInfo?.symbol}
            </Typography>
            <Typography sx={{ fontSize: "12px" }}>{tokenInfo?.name}</Typography>
          </Box>
        </Box>
        <TokenStandardLabel standard={tokenInfo?.standardType} />
      </Box>

      <Box sx={{ display: "flex", margin: "12px 0 0 0" }}>
        <Box sx={{ width: "50%" }}>
          <Typography fontSize="12px">Balance</Typography>
          <Typography color="textPrimary" sx={{ margin: "6px 0 0 0" }}>
            {nonNullArgs(tokenBalance) && tokenInfo
              ? formatAmount(parseTokenAmount(tokenBalance, tokenInfo.decimals).toString())
              : "--"}
          </Typography>
          <Typography className={classes.tokenAssets} sx={{ margin: "4px 0 0 0" }}>
            {nonNullArgs(tokenUSDPrice) && nonNullArgs(tokenBalance) && tokenInfo
              ? `≈
              ${formatDollarAmount(
                parseTokenAmount(tokenBalance, tokenInfo.decimals).multipliedBy(tokenUSDPrice).toString(),
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
        {DISPLAY_IN_WALLET_FOREVER.includes(canisterId) ? null : <RemoveToken canisterId={canisterId} />}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
          {SWAP_BUTTON_EXCLUDE.includes(canisterId) ? null : <Button label="Swap" onClick={handleToSwap} />}

          <Button label="Send" onClick={handleTransfer} />
          <Button label="Receive" onClick={handleReceive} />

          <TransactionButton
            tokenId={canisterId}
            principal={principal?.toString()}
            snsRootId={root_canister_id}
            isBridgeToken={isBridgeToken}
          />

          {canisterId === ICP.address && walletType === Connector.NFID ? (
            <Button label={t`NFID Transfer`} onClick={() => setNFIDTransferOpen(true)} />
          ) : null}

          {tokenInfo?.canisterId === XTC.address ? <Button label={t`Top-up`} onClick={handleXTCTopUp} /> : null}

          {tokenInfo?.canisterId === WRAPPED_ICP.address ? (
            <>
              <Button label={t`Unwrap`} onClick={() => handleWrappedICP("unwrap")} />
              <Button label={t`Wrap`} onClick={() => handleWrappedICP("wrap")} />
            </>
          ) : null}

          {allSupportedErc20Tokens
            .filter((ele) => ele.id === tokenInfo?.canisterId)
            .map((ele) => (
              <ChainKeyTokenButtons key={ele.id} ckToken={ele} />
            ))}
        </Box>
      </Box>

      {open && !!tokenInfo ? (
        <TransferModal
          open={open}
          onClose={handleCloseModal}
          token={tokenInfo}
          onTransferSuccess={handleTransferSuccess}
        />
      ) : null}

      {NFIDTransferOpen && !!tokenInfo ? (
        <NFIDTransfer
          open={NFIDTransferOpen}
          onClose={() => setNFIDTransferOpen(false)}
          token={tokenInfo}
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
              : tokenInfo?.standardType === TOKEN_STANDARD.EXT || tokenInfo?.canisterId === ICP.address
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
  chainKeyMinterInfo: Erc20MinterInfo | undefined;
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
        return <Token key={canisterId} canisterId={canisterId} chainKeyMinterInfo={chainKeyMinterInfo} />;
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
