import { useState, useContext, useMemo, useEffect } from "react";
import { Typography, Box, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { formatDollarAmount, parseTokenAmount, mockALinkAndOpen, BigNumber, principalToAccount } from "@icpswap/utils";
import TransferModal from "components/TokenTransfer/index";
import { NoData, LoadingRow } from "components/index";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { ICP, Connector, NO_HIDDEN_TOKENS } from "constants/index";
import { useAccount } from "store/global/hooks";
import { t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import WalletContext from "components/Wallet/context";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { TokenInfo } from "types/token";
import { useAccountPrincipal } from "store/auth/hooks";
import TokenStandardLabel from "components/token/TokenStandardLabel";
import { XTC, ckETH, ckBTC, WRAPPED_ICP } from "constants/tokens";
import XTCTopUpModal from "components/XTCTopup/index";
import { useInfoToken } from "hooks/uesInfoToken";
import { useCurrency } from "hooks/useCurrency";
import { INFO_URL } from "constants/index";
import { useConnectorType } from "store/auth/hooks";
import NFIDTransfer from "components/Wallet/NFIDTransfer";
import { useHistory } from "react-router-dom";
import { ICP_TOKEN_INFO, TOKEN_STANDARD } from "constants/tokens";
import { isHouseUserTokenTransactions } from "utils/index";
import { TokenImage } from "components/Image/Token";
import { useSNSTokenRootId } from "hooks/token/useSNSTokenRootId";
import { ReceiveModal } from "./Receive";

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
}));

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
}

function ActionButton({ label, onClick }: ActionButtonProps) {
  return (
    <Box
      sx={{
        display: "flex",
        padding: "7px 12px",
        justifyContent: "center",
        alignItems: "center",
        background: "#4F5A84",
        borderRadius: "8px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Typography color="text.primary">{label}</Typography>
    </Box>
  );
}

export const XTCTopUpIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.9987 13.334C10.9442 13.334 13.332 10.9462 13.332 8.00065C13.332 5.05513 10.9442 2.66732 7.9987 2.66732C5.05318 2.66732 2.66536 5.05513 2.66536 8.00065C2.66536 10.9462 5.05318 13.334 7.9987 13.334ZM7.9987 14.6673C11.6806 14.6673 14.6654 11.6825 14.6654 8.00065C14.6654 4.31875 11.6806 1.33398 7.9987 1.33398C4.3168 1.33398 1.33203 4.31875 1.33203 8.00065C1.33203 11.6825 4.3168 14.6673 7.9987 14.6673Z"
        fill="#5669DC"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.9678 6.58579L6.55359 8L7.9678 9.41421L9.38201 8L7.9678 6.58579ZM4.66797 8L7.9678 11.2998L11.2676 8L7.9678 4.70017L4.66797 8Z"
        fill="#5669DC"
      />
    </svg>
  );
};

function usePrincipalStandard(standard: string) {
  return standard.includes("DIP20") || standard.includes("ICRC");
}

type ckTOKEN = {
  id: string;
  mintPath: string;
  dissolvePath: string;
};

const ckTokens: ckTOKEN[] = [
  { id: ckBTC.address, mintPath: "/wallet/ckBTC?type=mint", dissolvePath: "/wallet/ckBTC?type=dissolve" },
  { id: ckETH.address, mintPath: "/wallet/ckETH?type=mint", dissolvePath: "/wallet/ckETH?type=dissolve" },
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
      <ActionButton label={t`Mint`} onClick={() => handleCKTokenMint(ckToken.mintPath)} />
      <ActionButton label={t`Dissolve`} onClick={() => handleCKTokenDissolve(ckToken.dissolvePath)} />
    </>
  );
}

const SWAP_BUTTON_EXCLUDE = [ICP_TOKEN_INFO.canisterId, WRAPPED_ICP.address];

export interface TokenListItemProps {
  isHideSmallBalances: boolean;
  searchValue: string;
  canisterId: string;
}

export function TokenListItem({ canisterId, isHideSmallBalances, searchValue }: TokenListItemProps) {
  const classes = useStyles();
  const account = useAccount();
  const theme = useTheme() as Theme;
  const principal = useAccountPrincipal();

  const walletType = useConnectorType();

  const history = useHistory();

  const [, currency] = useCurrency(canisterId);
  const { result: infoToken } = useInfoToken(currency?.address);

  const tokenUSDPrice = useMemo(() => {
    return infoToken?.priceUSD;
  }, [infoToken]);

  const { result: tokenInfo } = useTokenInfo(canisterId);
  const [XTCTopUpShow, setXTCTopUpShow] = useState(false);

  const [refreshInnerCounter, setRefreshInnerCounter] = useState<number>(0);

  const [open, setOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [NFIDTransferOpen, setNFIDTransferOpen] = useState(false);

  const { refreshCounter, setTotalValue, setTotalUSDBeforeChange } = useContext(WalletContext);

  const refreshNumber = useMemo(() => {
    return refreshInnerCounter + refreshCounter;
  }, [refreshInnerCounter, refreshCounter]);

  const { result: tokenBalance } = useTokenBalance(canisterId, principal, refreshNumber);

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
  }, [tokenBalance, infoToken, tokenInfo]);

  const handleTransferSuccess = () => {
    setRefreshInnerCounter(refreshInnerCounter + 1);
    handleCloseModal();
    setNFIDTransferOpen(false);
  };

  const handleTopUpSuccess = () => {
    setRefreshInnerCounter(refreshInnerCounter + 1);
  };

  const handleCloseModal = async () => {
    setOpen(false);
  };

  const handleTransfer = async () => {
    setOpen(true);
  };

  const root_canister_id = useSNSTokenRootId(canisterId);

  const handleToTransactions = () => {
    if (!tokenInfo || !principal) return;

    const { canisterId, standardType, symbol } = tokenInfo;

    if (symbol === ICP_TOKEN_INFO.symbol) {
      mockALinkAndOpen(`https://dashboard.internetcomputer.org/account//${account}`, "TOKEN_TRANSACTIONS");
    } else if (!!root_canister_id) {
      mockALinkAndOpen(
        `https://dashboard.internetcomputer.org/sns/${root_canister_id}/account/${principal.toString()}`,
        "TOKEN_TRANSACTIONS",
      );
    } else if (tokenInfo.standardType === TOKEN_STANDARD.ICRC1 || tokenInfo.standardType === TOKEN_STANDARD.ICRC2) {
      const url = isHouseUserTokenTransactions(tokenInfo.canisterId, principal?.toString());
      mockALinkAndOpen(url, "TOKEN_TRANSACTIONS");
    } else {
      mockALinkAndOpen(
        `${INFO_URL}/token/transactions/${canisterId}/${principal?.toString()}?standard=${standardType}`,
        "TOKEN_TRANSACTIONS",
      );
    }
  };

  const handleLoadToDetail = (tokenInfo: TokenInfo | undefined) => {
    if (tokenInfo && tokenInfo.symbol !== ICP_TOKEN_INFO.symbol) {
      mockALinkAndOpen(
        `${INFO_URL}/token/details/${tokenInfo?.canisterId}?standard=${tokenInfo?.standardType}`,
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
    const hiddenBySmallBalance = isHideSmallBalances && !!tokenBalance && !tokenBalance?.isGreaterThan(0);

    const hiddenBySearchValue = !!searchValue
      ? !tokenInfo?.symbol
        ? true
        : !tokenInfo?.symbol.toLowerCase().includes(searchValue.toLowerCase())
      : false;

    if (NO_HIDDEN_TOKENS.includes(canisterId)) return false;

    return hiddenBySmallBalance || hiddenBySearchValue;
  }, [isHideSmallBalances, tokenBalance, canisterId, searchValue, tokenInfo]);

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
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: "0 10px" }}>
          <TokenImage width="40px" height="40px" src={tokenInfo?.logo} />
          <Box>
            <Typography
              color="textPrimary"
              className={tokenInfo?.symbol !== ICP_TOKEN_INFO.symbol ? classes.walletSymbol : ""}
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
          <Typography color="textPrimary" sx={{ margin: "4px 0 0 0" }}>
            {parseTokenAmount(tokenBalance, tokenInfo?.decimals).toFormat()}
          </Typography>
          <Typography className={classes.tokenAssets}>
            {tokenUSDPrice && tokenBalance
              ? `≈
              ${formatDollarAmount(
                parseTokenAmount(tokenBalance, tokenInfo?.decimals)
                  .multipliedBy(tokenUSDPrice)
                  .toString(),
                4,
              )}`
              : "--"}
          </Typography>
        </Box>
        <Box sx={{ width: "50%" }}>
          <Typography fontSize="12px">Price</Typography>
          <Typography color="textPrimary" sx={{ margin: "4px 0 0 0" }}>
            {tokenUSDPrice ? formatDollarAmount(tokenUSDPrice) : "--"}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{ margin: "24px 0 0 0", display: "flex", justifyContent: "flex-end", gap: "10px 10px", flexWrap: "wrap" }}
      >
        {SWAP_BUTTON_EXCLUDE.includes(canisterId) ? null : <ActionButton label="Swap" onClick={handleToSwap} />}

        <ActionButton label="Send" onClick={handleTransfer} />
        <ActionButton label="Receive" onClick={handleReceive} />
        <ActionButton label="Transactions" onClick={handleToTransactions} />

        {canisterId === ICP.address && walletType === Connector.NFID ? (
          <ActionButton label={t`NFID Transfer`} onClick={() => setNFIDTransferOpen(true)} />
        ) : null}

        {tokenInfo?.canisterId === XTC.address ? <ActionButton label={t`Top-up`} onClick={handleXTCTopUp} /> : null}

        {tokenInfo?.canisterId === WRAPPED_ICP.address ? (
          <>
            <ActionButton label={t`Unwrap`} onClick={() => handleWrappedICP("unwrap")} />
            <ActionButton label={t`Wrap`} onClick={() => handleWrappedICP("wrap")} />
          </>
        ) : null}

        {ckTokens
          .filter((ele) => ele.id === tokenInfo?.canisterId)
          .map((ele) => (
            <ChainKeyTokenButtons key={ele.id} ckToken={ele} />
          ))}
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
  list: string[];
  loading?: boolean;
  isHideSmallBalances: boolean;
  searchValue: string;
}

export default function TokenList({ list, loading, isHideSmallBalances, searchValue }: TokenListProps) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "20px",
        "@media(max-width: 1088px)": {
          gridTemplateColumns: "1fr 1fr",
          gap: "12px 0",
        },
        "@media(max-width: 640px)": {
          gridTemplateColumns: "1fr",
          gap: "12px 0",
        },
      }}
    >
      {list.map((canisterId) => {
        return (
          <TokenListItem
            key={canisterId}
            canisterId={canisterId}
            isHideSmallBalances={isHideSmallBalances}
            searchValue={searchValue}
          />
        );
      })}

      {list.length === 0 && !loading ? <NoData /> : null}

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
