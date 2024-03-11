import { useState, useContext, useMemo, useEffect } from "react";
import { Button, Grid, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { formatDollarAmount, parseTokenAmount, mockALinkToOpen } from "@icpswap/utils";
import { SendIcon, ReceiveIcon, TransferDetailIcon } from "assets/images/icons";
import TransferModal from "components/TokenTransfer/index";
import { NoData, LoadingRow } from "components/index";
import AddressClipboard from "components/AddressClipboard";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { ICP, NO_HIDDEN_TOKENS, Connector } from "constants/index";
import { useAccount } from "store/global/hooks";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import WalletContext from "components/Wallet/context";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { TokenInfo } from "types/token";
import { useAccountPrincipal } from "store/auth/hooks";
import TokenStandardLabel from "components/token/TokenStandardLabel";
import { XTC, ckETH, ckBTC, WRAPPED_ICP } from "constants/tokens";
import XTCTopUpModal from "components/XTCTopup/index";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useCurrency } from "hooks/useCurrency";
import { INFO_URL } from "constants/index";
import { useConnectorType } from "store/auth/hooks";
import NFIDTransfer from "components/Wallet/NFIDTransfer";
import { useHistory } from "react-router-dom";
import { ICP_TOKEN_INFO, TOKEN_STANDARD } from "constants/tokens";
import { isHouseUserTokenTransactions } from "utils/index";
import { TokenImage } from "components/Image/Token";
import { Header, HeaderCell, Row, BodyCell } from "components/Table/index";
import { useSNSTokenRootId } from "hooks/token/useSNSTokenRootId";

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    gridTemplateColumns: "420px repeat(3, 180px) 1fr",
    "@media(max-width: 640px)": {
      minWidth: "1340px",
      gridTemplateColumns: "240px repeat(3, 180px) 1fr",
    },
  },
  greenButton: {
    "& .MuiButton-root": {
      color: "#54C081",
      borderColor: "#54C081",
      "&:hover": {
        background: "rgba(84, 192, 129, 0.1)",
      },
    },
  },
  redButton: {
    "& .MuiButton-root": {
      color: "#D3625B",
      borderColor: "#D3625B",
      "&:hover": {
        background: "rgba(211, 98, 91, 0.1)",
      },
    },
  },
  actionButton: {
    width: "100%",
  },
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

export const MintIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 7.50313C10.6516 7.50313 13.4688 6.63281 13.4688 5.01719C13.4688 3.40156 10.6516 2.53125 8 2.53125C5.34844 2.53125 2.53125 3.40156 2.53125 5.01719C2.53125 6.63281 5.34844 7.50313 8 7.50313ZM8 3.525C10.7312 3.525 12.475 4.40781 12.475 5.01719C12.475 5.62656 10.7312 6.50781 8 6.50781C5.26875 6.50781 3.525 5.625 3.525 5.01719C3.525 4.40938 5.26875 3.525 8 3.525Z"
        fill="#5669DC"
        stroke="#5669DC"
        strokeWidth="0.4"
      />
      <path
        d="M3.52215 7.10553C3.30028 6.94303 2.98934 6.99303 2.8284 7.2149C2.62528 7.49303 2.52528 7.7899 2.53153 8.09615C2.54403 8.84459 3.18465 9.49615 4.33153 9.93209C5.27996 10.293 6.50965 10.4868 7.81434 10.4868C7.88934 10.4868 7.9659 10.4852 8.04246 10.4852C10.694 10.4383 13.4956 9.51803 13.4675 7.90553C13.4643 7.67115 13.3987 7.44303 13.2706 7.22584C13.1315 6.98834 12.8237 6.91022 12.5909 7.04928C12.3534 7.18834 12.2737 7.49303 12.4143 7.73053C12.4534 7.79772 12.4722 7.85865 12.4737 7.92115C12.4847 8.52897 10.7565 9.44147 8.02528 9.49147C6.7534 9.50709 5.57371 9.3399 4.68621 9.0024C3.98621 8.73678 3.53153 8.37428 3.52684 8.0774C3.52528 7.99303 3.56121 7.89928 3.63153 7.80084C3.79246 7.5774 3.74403 7.26647 3.52215 7.10553Z"
        fill="#5669DC"
        stroke="#5669DC"
        strokeWidth="0.4"
      />
      <path
        d="M12.5219 10.0498C12.2953 10.2029 12.2328 10.5123 12.3875 10.7404C12.4469 10.8279 12.475 10.9076 12.475 10.9826C12.475 11.5904 10.7312 12.4748 8 12.4748C5.26875 12.4748 3.525 11.5904 3.525 10.9826C3.525 10.9091 3.55156 10.8326 3.60469 10.7513C3.75469 10.5216 3.69219 10.2138 3.4625 10.0623C3.23281 9.91227 2.925 9.97633 2.77344 10.2045C2.6125 10.4498 2.53125 10.7107 2.53125 10.981C2.53125 12.5982 5.34844 13.4685 8 13.4685C10.6516 13.4685 13.4688 12.5982 13.4688 10.9826C13.4688 10.706 13.3828 10.4373 13.2125 10.1841C13.0594 9.95602 12.75 9.89664 12.5219 10.0498Z"
        fill="#5669DC"
        stroke="#5669DC"
        strokeWidth="0.4"
      />
    </svg>
  );
};

export function DissolveIcon() {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.3493 14.7192H4.01922C3.50503 14.7182 3.0123 14.5291 2.64913 14.1934C2.28595 13.8578 2.08201 13.403 2.08203 12.9289V2.36834C2.08201 2.05873 2.21518 1.76176 2.45233 1.54258C2.68948 1.3234 3.01123 1.19992 3.347 1.19922H14.4263C14.5883 1.1995 14.7475 1.23875 14.888 1.31311C15.0285 1.38746 15.1455 1.49434 15.2275 1.62318C15.3095 1.75203 15.3536 1.89837 15.3555 2.04774C15.3573 2.19712 15.3169 2.34435 15.2381 2.4749L14.2864 4.05738V12.9289C14.2864 13.403 14.0824 13.8577 13.7193 14.1934C13.3561 14.529 12.8634 14.7181 12.3493 14.7192ZM3.347 2.29522C3.32594 2.29526 3.30576 2.30301 3.29089 2.31677C3.27602 2.33052 3.26768 2.34916 3.2677 2.36858V12.9289C3.2677 13.1128 3.34682 13.2893 3.48771 13.4195C3.6286 13.5497 3.81975 13.623 4.01922 13.6235H12.3493C12.5487 13.623 12.7398 13.5496 12.8806 13.4194C13.0215 13.2892 13.1006 13.1128 13.1006 12.9289V3.77322L13.9901 2.29522H3.347Z"
        fill="#D3625B"
      />
      <path d="M7.34584 6.5122H3.00781V5.4082H7.34584V6.5122Z" fill="#D3625B" />
      <path d="M13.8547 9.5122H7.34766V8.4082H13.8547V9.5122Z" fill="#D3625B" />
    </svg>
  );
}

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
  const classes = useStyles();
  const history = useHistory();

  const handleCKTokenMint = (path: string) => {
    history.push(path);
  };

  const handleCKTokenDissolve = (path: string) => {
    history.push(path);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        className={classes.actionButton}
        startIcon={<MintIcon />}
        onClick={() => handleCKTokenMint(ckToken.mintPath)}
      >
        <Trans>Mint</Trans>
      </Button>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        className={classes.actionButton}
        startIcon={<DissolveIcon />}
        onClick={() => handleCKTokenDissolve(ckToken.dissolvePath)}
      >
        <Trans>Dissolve</Trans>
      </Button>
    </>
  );
}

export interface TokenListItemProps {
  isHideSmallBalances: boolean;
  searchValue: string;
  canisterId: string;
}

export function TokenListItem({ canisterId, isHideSmallBalances, searchValue }: TokenListItemProps) {
  const classes = useStyles();
  const account = useAccount();
  const principal = useAccountPrincipal();

  const walletType = useConnectorType();

  const history = useHistory();

  const [, currency] = useCurrency(canisterId);
  const tokenUSDPrice = useUSDPrice(currency);

  const { result: tokenInfo } = useTokenInfo(canisterId);
  const [XTCTopUpShow, setXTCTopUpShow] = useState(false);

  const [refreshInnerCounter, setRefreshInnerCounter] = useState<number>(0);

  const [open, setOpen] = useState(false);
  const [NFIDTransferOpen, setNFIDTransferOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const { refreshCounter, setTotalValue } = useContext(WalletContext);

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
      tokenUSDPrice
    ) {
      setTotalValue(
        tokenInfo.canisterId,
        parseTokenAmount(tokenBalance, tokenInfo.decimals).multipliedBy(tokenUSDPrice),
      );
    }
  }, [tokenBalance, tokenUSDPrice, tokenInfo]);

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
      mockALinkToOpen(`https://dashboard.internetcomputer.org/account//${account}`, "TOKEN_TRANSACTIONS");
    } else if (!!root_canister_id) {
      mockALinkToOpen(
        `https://dashboard.internetcomputer.org/sns/${root_canister_id}/account/${principal.toString()}`,
        "TOKEN_TRANSACTIONS",
      );
    } else if (tokenInfo.standardType === TOKEN_STANDARD.ICRC1 || tokenInfo.standardType === TOKEN_STANDARD.ICRC2) {
      const url = isHouseUserTokenTransactions(tokenInfo.canisterId, principal?.toString());
      mockALinkToOpen(url, "TOKEN_TRANSACTIONS");
    } else {
      mockALinkToOpen(
        `${INFO_URL}/token/transactions/${canisterId}/${principal?.toString()}?standard=${standardType}`,
        "TOKEN_TRANSACTIONS",
      );
    }
  };

  const handleLoadToDetail = (tokenInfo: TokenInfo | undefined) => {
    if (tokenInfo && tokenInfo.symbol !== ICP_TOKEN_INFO.symbol) {
      mockALinkToOpen(
        `${INFO_URL}/token/details/${tokenInfo?.canisterId}?standard=${tokenInfo?.standardType}`,
        "TOKEN_DETAILs",
      );
    }
  };

  const handleXTCTopUp = () => {
    setXTCTopUpShow(true);
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

  const handleCKTokenMint = (path: string) => {
    history.push(path);
  };

  const handleCKTokenDissolve = (path: string) => {
    history.push(path);
  };

  const handleWrappedICP = (value: "wrap" | "unwrap") => {
    if (value === "wrap") {
      history.push("/swap/v2/wrap?input=icp");
      return;
    }

    history.push("/swap/v2/wrap?input=wicp");
  };

  return (
    <>
      <Row className={classes.wrapper} sx={{ ...(isHidden ? { display: "none" } : {}) }}>
        <BodyCell>
          <Box sx={{ display: "flex", flexWrap: "nowrap", alignItems: "center", gap: "0 8px" }}>
            <TokenImage width="40px" height="40px" src={tokenInfo?.logo} />
            <Box>
              <Typography
                color="textPrimary"
                className={tokenInfo?.symbol !== ICP_TOKEN_INFO.symbol ? classes.walletSymbol : ""}
                onClick={() => handleLoadToDetail(tokenInfo)}
              >
                {tokenInfo?.symbol}
              </Typography>
              <Typography>{tokenInfo?.name}</Typography>
            </Box>
          </Box>
        </BodyCell>
        <BodyCell>
          <TokenStandardLabel standard={tokenInfo?.standardType} />
        </BodyCell>
        <BodyCell>
          <Grid item xs={12}>
            <Typography color="textPrimary">
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
          </Grid>
        </BodyCell>
        <BodyCell>{tokenUSDPrice ? formatDollarAmount(tokenUSDPrice) : "--"}</BodyCell>
        <BodyCell>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gridTemplateRows:
                canisterId === XTC.address || (canisterId === ICP.address && walletType === Connector.NFID)
                  ? "1fr 1fr"
                  : "1fr",
              gap: "10px 10px",
            }}
          >
            <Box className={classes.greenButton}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                className={classes.actionButton}
                startIcon={<ReceiveIcon />}
                onClick={() => setAddressModalOpen(true)}
              >
                <Trans>Receive</Trans>
              </Button>
            </Box>

            <Box className={classes.redButton}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                className={classes.actionButton}
                startIcon={<SendIcon />}
                onClick={handleTransfer}
              >
                <Trans>Transfer</Trans>
              </Button>
            </Box>

            <Box>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                className={classes.actionButton}
                startIcon={<TransferDetailIcon />}
                onClick={handleToTransactions}
              >
                <Trans>Transactions</Trans>
              </Button>
            </Box>

            {canisterId === ICP.address && walletType === Connector.NFID ? (
              <Box className={classes.redButton}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  className={classes.actionButton}
                  startIcon={<SendIcon />}
                  onClick={() => setNFIDTransferOpen(true)}
                >
                  <Trans>NFID Transfer</Trans>
                </Button>
              </Box>
            ) : null}

            {tokenInfo?.canisterId === XTC.address ? (
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  className={classes.actionButton}
                  startIcon={<XTCTopUpIcon />}
                  onClick={handleXTCTopUp}
                >
                  <Trans>Top-up</Trans>
                </Button>
              </Box>
            ) : null}

            {tokenInfo?.canisterId === WRAPPED_ICP.address ? (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  className={classes.actionButton}
                  onClick={() => handleWrappedICP("unwrap")}
                >
                  <Trans>Unwrap</Trans>
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  className={classes.actionButton}
                  onClick={() => handleWrappedICP("wrap")}
                >
                  <Trans>Wrap</Trans>
                </Button>
              </>
            ) : null}

            {ckTokens
              .filter((ele) => ele.id === tokenInfo?.canisterId)
              .map((ele) => (
                <ChainKeyTokenButtons key={ele.id} ckToken={ele} />
              ))}
          </Box>
        </BodyCell>
      </Row>

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

      <AddressClipboard
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        address={
          !!tokenInfo?.standardType && usePrincipalStandard(tokenInfo.standardType as string)
            ? principal?.toString() ?? ""
            : account
        }
      />

      {XTCTopUpShow ? (
        <XTCTopUpModal open={XTCTopUpShow} onClose={() => setXTCTopUpShow(false)} onTopUpSuccess={handleTopUpSuccess} />
      ) : null}
    </>
  );
}

export interface TokenListProps {
  list: string[];
  loading?: boolean;
  isHideSmallBalances: boolean;
  searchValue: string;
}

export default function TokenList({ list, loading, isHideSmallBalances, searchValue }: TokenListProps) {
  const classes = useStyles();

  return (
    <Box sx={{ width: "100%" }}>
      <Header className={classes.wrapper}>
        <HeaderCell>
          <Trans>Token</Trans>
        </HeaderCell>

        <HeaderCell>
          <Trans>Standard</Trans>
        </HeaderCell>

        <HeaderCell>
          <Trans>Balance</Trans>
        </HeaderCell>

        <HeaderCell>
          <Trans>Price</Trans>
        </HeaderCell>

        <HeaderCell>
          <Trans>Action</Trans>
        </HeaderCell>
      </Header>

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
