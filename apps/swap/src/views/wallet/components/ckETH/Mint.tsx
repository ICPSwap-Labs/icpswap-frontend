import { Box, Typography, InputAdornment } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { useTheme } from "@mui/styles";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useMemo, useState } from "react";
import { useTips, MessageTypes } from "hooks/useTips";
import { NumberFilledTextField, type Tab } from "components/index";
import { principalToBytes32 } from "utils/ic/index";
import { useETHContract } from "hooks/web3/useContract";
import { useWeb3React } from "@web3-react/core";
import { toHexString } from "utils/web3/index";
import { useETHBalance } from "hooks/web3/useETHBalance";
import { parseTokenAmount, toSignificant } from "@icpswap/utils";
import { useBlockNumber } from "hooks/web3/useBlockNumber";
import { useUpdateTX } from "store/web3/hooks";
import ButtonConnector from "components/authentication/ButtonConnector";
import { Web3ButtonConnector } from "components/web3/index";
import { RefreshIcon } from "assets/icons/Refresh";
import { chainIdToNetwork, chain } from "constants/web3";
import { useTokenBalance } from "hooks/token";
import { ckETH } from "constants/tokens";
import { Theme } from "@mui/material/styles";
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
  minterInfo?: Erc20MinterInfo;
}

export default function MintCkETH({ buttons, handleChange, active, minterInfo }: MintProps) {
  const principal = useAccountPrincipalString();
  const { account, provider, chainId } = useWeb3React();

  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState<number | undefined | "">(undefined);

  const blockNumber = useBlockNumber();

  const [openTip] = useTips();

  const { result: ethBalance, loading: balanceLoading } = useETHBalance(reload);
  const { result: ckETHBalance, loading: ckBalanceLoading } = useTokenBalance(ckETH.address, principal, reload);

  const bytes32 = useMemo(() => {
    if (principal) return principalToBytes32(principal);
    return undefined;
  }, [principal]);

  const handelUpdateBalance = async () => {
    setReload(!reload);
  };

  const ethMinter = useETHContract();

  const updateUserTx = useUpdateTX();

  const handleMint = async () => {
    if (!ethMinter || !principal || !provider || !bytes32 || !amount || !blockNumber) return;

    setLoading(true);

    const tx = {
      to: ethMinter.address,
      data: ethMinter.interface.encodeFunctionData("deposit", [bytes32]),
      value: toHexString(amount),
    };

    const result = await provider
      .getSigner()
      .sendTransaction(tx)
      .catch((err) => {
        console.error(err);
        openTip("Transaction for minting ckETH failed to submit", MessageTypes.error);
      });

    if (result) {
      setAmount("");

      openTip("ckETH minting in progress: Transaction submitted and pending confirmation.", MessageTypes.success);

      updateUserTx(principal, {
        timestamp: String(new Date().getTime()),
        block: String(blockNumber),
        hash: result.hash,
        from: result.from,
        to: result.to,
        value: result.value.toString(),
        gas: result.gasPrice?.toString(),
      });
    }

    setLoading(false);
  };

  let error = "";

  if (!!chainId && chain !== chainId) error = `Please switch to ${chainIdToNetwork[chain]}`;
  if (!!amount && ethBalance && ethBalance.isLessThan(amount)) error = t`Insufficient Balance`;
  if (!amount) error = t`Enter the amount`;

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
              <Typography fontSize="16px">Transfer ETH (Ethereum Mainnet) amount:</Typography>
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
                          ETH
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
              disabled={loading || !account || !amount || !!error}
              loading={loading}
            >
              {error || t`Mint ckETH`}
            </ButtonConnector>
          </Box>

          <Links />
        </MainContent>
      }
      logo={
        <LogosWrapper>
          <Logo type="mint" />

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
              {ethBalance && !balanceLoading ? toSignificant(ethBalance.toString()) : "--"}{" "}
              <Typography component="span" fontSize="16px">
                ETH
              </Typography>
            </Typography>

            <Typography sx={{ fontWeight: 600, fontSize: "18px", color: "text.primary" }}>
              {ckETHBalance && !ckBalanceLoading
                ? toSignificant(parseTokenAmount(ckETHBalance, ckETH.decimals).toString())
                : "--"}{" "}
              <Typography component="span" fontSize="16px">
                ckETH
              </Typography>
            </Typography>
          </Box>
        </LogosWrapper>
      }
      transactions={<Transaction blockNumber={blockNumber} minterInfo={minterInfo} />}
    />
  );
}
