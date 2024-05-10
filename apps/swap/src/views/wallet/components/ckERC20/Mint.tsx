import { Box, Typography, InputAdornment } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { useTheme } from "@mui/styles";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useMemo, useState } from "react";
import { NumberFilledTextField, type Tab } from "components/index";
import { principalToBytes32 } from "utils/ic/index";
import { useERC20MinterHelperContract } from "hooks/web3/useContract";
import { useWeb3React } from "@web3-react/core";
import { useERC20Balance } from "hooks/web3/useERC20Balance";
import { formatTokenAmount, parseTokenAmount, toSignificant } from "@icpswap/utils";
import { useBlockNumber } from "hooks/web3/useBlockNumber";
import ButtonConnector from "components/authentication/ButtonConnector";
import { Web3ButtonConnector } from "components/web3/index";
import { RefreshIcon } from "assets/icons/Refresh";
import { chainIdToNetwork, chain } from "constants/web3";
import { useTokenBalance } from "hooks/token";
import { Theme } from "@mui/material/styles";
import { ERC20Token, Token } from "@icpswap/swap-sdk";
import { CK_ERC20_HELPER_SMART_CONTRACT } from "constants/ckERC20";
import { ApprovalState, useApproveCallback } from "hooks/web3/useApproveCallback";
import { useMintCkERC20Callback } from "hooks/web3/useMintCkERC20";

import { MainContent } from "../ckTokens/MainContent";
import { LogosWrapper } from "../ckTokens/LogosWrapper";
import Links from "./Links";
import Transaction from "./Transaction";
import Logo from "./Logo";
import { Wrapper } from "../ckTokens/Wrapper";

interface DeadContentProps {
  content: string | undefined;
}

function DeadContent({ content }: DeadContentProps) {
  const theme = useTheme() as Theme;

  return (
    <Box
      sx={{
        padding: "14px 16px",
        borderRadius: "8px",
        background: theme.palette.background.level4,
      }}
    >
      <Typography sx={{ wordBreak: "break-all", fontWeight: 500 }}>
        {content || <Typography height="10px" width="2px" />}
      </Typography>
    </Box>
  );
}

export interface MintProps {
  buttons: { key: string; value: string }[];
  handleChange: (button: Tab) => void;
  active: string;
  token: Token | undefined;
  erc20Token: ERC20Token | undefined;
}

export default function MintCkERC20({ buttons, handleChange, active, token, erc20Token }: MintProps) {
  const principal = useAccountPrincipalString();
  const { account, chainId } = useWeb3React();

  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState<number | undefined | "">(undefined);

  const blockNumber = useBlockNumber();

  const { result: ercTokenBalance, loading: balanceLoading } = useERC20Balance(erc20Token?.address, reload);
  const { result: tokenBalance, loading: ckBalanceLoading } = useTokenBalance(token?.address, principal, reload);

  const bytes32 = useMemo(() => {
    if (principal) return principalToBytes32(principal);
    return undefined;
  }, [principal]);

  const handelUpdateBalance = async () => {
    setReload(!reload);
  };

  const erc20MinterHelper = useERC20MinterHelperContract(CK_ERC20_HELPER_SMART_CONTRACT);

  const approveAmount = useMemo(() => {
    if (!amount || !erc20Token) return undefined;
    return formatTokenAmount(amount, erc20Token.decimals).toString();
  }, [amount, erc20Token]);

  const [approveState, approve] = useApproveCallback(approveAmount, erc20Token, CK_ERC20_HELPER_SMART_CONTRACT);

  const handleApprove = async () => {
    if (!erc20Token || !amount) return;

    setLoading(true);
    await approve();
    setLoading(false);
  };

  const mintCkERC20 = useMintCkERC20Callback();

  const handleMint = async () => {
    if (!erc20MinterHelper || !erc20Token || !principal || !bytes32 || !amount) return;

    setLoading(true);
    const response = await mintCkERC20(erc20Token, amount);
    if (response && response.hash) {
      setAmount("");
    }
    setLoading(false);
  };

  const handleClick = async () => {
    if (approveState === ApprovalState.APPROVED) {
      handleMint();
    } else {
      handleApprove();
    }
  };

  const error = useMemo(() => {
    if (!!chainId && chain !== chainId) return t`Please switch to ${chainIdToNetwork[chain]}`;
    if (!amount) return t`Enter the amount`;
    if (
      !!amount &&
      ercTokenBalance &&
      erc20Token &&
      parseTokenAmount(ercTokenBalance, erc20Token.decimals).isLessThan(amount)
    )
      return t`Insufficient Balance`;

    return undefined;
  }, [chainId, chain, amount, erc20Token, ercTokenBalance, approveState]);

  return (
    <Wrapper
      main={
        <MainContent buttons={buttons} onChange={handleChange} active={active}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px 0",
            }}
          >
            <Box>
              <Typography fontSize="16px">Your wallet of IC network</Typography>
              <Box sx={{ margin: "12px 0 0 0" }}>
                <DeadContent content={principal} />
              </Box>
            </Box>

            <Box>
              <Typography fontSize="16px">Principal → Bytes32</Typography>
              <Box sx={{ margin: "12px 0 0 0" }}>
                <DeadContent content={bytes32} />
              </Box>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Typography fontSize="16px">Your wallet of Metamask</Typography>
              <Box sx={{ margin: "12px 0 0 0" }}>
                {account ? <DeadContent content={account} /> : <Web3ButtonConnector chainId={chain} />}
              </Box>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Typography fontSize="16px">
                {erc20Token ? <Trans>Transfer {erc20Token.symbol} (Ethereum Mainnet) amount:</Trans> : "--"}
              </Typography>
              <Box sx={{ margin: "12px 0 0 0" }}>
                <NumberFilledTextField
                  value={amount}
                  numericProps={{
                    decimalScale: 8,
                    thousandSeparator: true,
                  }}
                  onChange={(value: number) => setAmount(value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <Typography component="span" color="text.primary">
                          {erc20Token?.symbol ?? "--"}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ margin: "32px 0 0 0" }}>
            <ButtonConnector
              variant="contained"
              fullWidth
              size="large"
              onClick={handleClick}
              disabled={loading || !account || !amount || !!error || approveState === ApprovalState.PENDING}
              loading={loading || approveState === ApprovalState.PENDING}
            >
              {error || approveState === ApprovalState.APPROVED || approveState === ApprovalState.PENDING
                ? t`Mint ck${erc20Token?.symbol}`
                : t`Approve`}
            </ButtonConnector>
          </Box>

          <Links ckToken={token} />
        </MainContent>
      }
      logo={
        <LogosWrapper>
          <Logo type="mint" token={token} erc20Token={erc20Token} />

          <Box sx={{ margin: "32px 0 0 0", display: "grid", gridTemplateColumns: "1fr", gap: "10px 0" }}>
            <Box sx={{ display: "flex", gap: "0 4px", alignItems: "center" }}>
              <Typography fontSize="16px">
                <Trans>Balance</Trans>
              </Typography>

              <Box
                sx={{
                  cursor: "pointer",
                }}
                onClick={handelUpdateBalance}
              >
                <RefreshIcon fill="#ffffff" />
              </Box>
            </Box>

            <Typography sx={{ fontWeight: 600, fontSize: "18px", color: "text.primary" }}>
              {ercTokenBalance && !balanceLoading && erc20Token
                ? toSignificant(parseTokenAmount(ercTokenBalance, erc20Token.decimals).toString())
                : "--"}
              <Typography component="span" fontSize="16px">
                &nbsp;{erc20Token?.symbol}
              </Typography>
            </Typography>

            <Typography sx={{ fontWeight: 600, fontSize: "18px", color: "text.primary" }}>
              {tokenBalance && !ckBalanceLoading
                ? toSignificant(parseTokenAmount(tokenBalance, token?.decimals).toString())
                : "--"}
              <Typography component="span" fontSize="16px">
                &nbsp;{token?.symbol}
              </Typography>
            </Typography>
          </Box>
        </LogosWrapper>
      }
      transactions={<Transaction blockNumber={blockNumber} />}
    />
  );
}
