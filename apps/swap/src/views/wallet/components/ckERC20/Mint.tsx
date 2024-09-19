import { Box, Typography, InputAdornment } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { useTheme } from "@mui/styles";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useCallback, useMemo, useState } from "react";
import { NumberFilledTextField, type Tab } from "components/index";
import { principalToBytes32 } from "utils/ic/index";
import { useERC20MinterHelperContract, useActiveChain } from "hooks/web3/index";
import { useWeb3React } from "@web3-react/core";
import { useERC20Balance } from "hooks/web3/useERC20Balance";
import { parseTokenAmount, toSignificant } from "@icpswap/utils";
import { useBlockNumber } from "hooks/web3/useBlockNumber";
import ButtonConnector from "components/authentication/ButtonConnector";
import { Web3ButtonConnector } from "components/web3/index";
import { RefreshIcon } from "assets/icons/Refresh";
import { chainIdToNetwork, chain } from "constants/web3";
import { useTokenBalance } from "hooks/token";
import { Theme } from "@mui/material/styles";
import { ERC20Token, Token } from "@icpswap/swap-sdk";
import { ApprovalState } from "hooks/web3/useApproveCallback";
import { useMintCallback } from "hooks/ck-erc20/index";
import type { Erc20MinterInfo } from "@icpswap/types";

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
      <Typography sx={{ wordBreak: "break-all", fontWeight: 500, lineHeight: "1.15rem" }}>
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
  minterInfo: Erc20MinterInfo | undefined;
}

export default function MintCkERC20({ buttons, handleChange, active, token, erc20Token, minterInfo }: MintProps) {
  const principal = useAccountPrincipalString();
  const { account } = useWeb3React();
  const chainId = useActiveChain();

  const [reload, setReload] = useState(false);

  const [amount, setAmount] = useState<number | string | undefined>(undefined);

  const blockNumber = useBlockNumber();

  const { result: ercTokenBalance, loading: balanceLoading } = useERC20Balance(erc20Token?.address);
  const { result: tokenBalance, loading: ckBalanceLoading } = useTokenBalance(token?.address, principal, reload);

  const bytes32 = useMemo(() => {
    if (principal) return principalToBytes32(principal);
    return undefined;
  }, [principal]);

  const handelUpdateBalance = async () => {
    setReload(!reload);
  };

  const helperContractAddress = useMemo(() => {
    if (!minterInfo) return undefined;
    return minterInfo.erc20_helper_contract_address[0];
  }, [minterInfo]);

  const erc20MinterHelper = useERC20MinterHelperContract(helperContractAddress);

  const { loading, mint_call, approveState } = useMintCallback({ erc20Token, helperContractAddress, amount });

  const handleMint = useCallback(async () => {
    if (!token || !erc20MinterHelper || !erc20Token || !principal || !bytes32 || !amount || !blockNumber) return;

    const response = await mint_call(erc20Token, amount, token, blockNumber);

    if (response && response.hash) {
      setAmount("");
    }
  }, [mint_call, token, blockNumber]);

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
  }, [chainId, chain, amount, erc20Token, ercTokenBalance]);

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
                  placeholder="0.00"
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
              onClick={handleMint}
              disabled={loading || !account || !amount || !!error || approveState === ApprovalState.PENDING}
              loading={loading || approveState === ApprovalState.PENDING}
            >
              {error === undefined
                ? approveState === ApprovalState.APPROVED || approveState === ApprovalState.PENDING
                  ? t`Mint ck${erc20Token?.symbol}`
                  : t`Approve`
                : error}
            </ButtonConnector>
          </Box>

          <Links ckToken={token} helperContract={helperContractAddress} />
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
      transactions={<Transaction blockNumber={blockNumber} ledger={token?.address} minterInfo={minterInfo} />}
    />
  );
}
