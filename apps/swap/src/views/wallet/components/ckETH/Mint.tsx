import { Box, Typography, InputAdornment } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useMemo, useState } from "react";
import { useTips, MessageTypes } from "hooks/useTips";
import { MainCard, NumberFilledTextField } from "components/index";
import Toggle, { ToggleButton } from "components/SwitchToggle";
import { principalToBytes32 } from "utils/ic/index";
import { useETHContract } from "hooks/web3/useETHContract";
import { useWeb3React } from "@web3-react/core";
import { toHexString } from "utils/web3/index";
import { useETHBalance } from "hooks/web3/useETHBalance";
import { parseTokenAmount, toSignificant } from "@icpswap/utils";
import { useBlockNumber } from "hooks/web3/useBlockNumber";
import { useUpdateTX } from "store/web3/hooks";
import ButtonConnector from "components/authentication/ButtonConnector";
import { Web3ButtonConnector } from "components/web3/index";
import { chain } from "constants/ckETH";
import { RefreshIcon } from "assets/icons/Refresh";
import { chainIdToNetwork } from "constants/web3";
import { useTokenBalance } from "hooks/token";
import { ckETH } from "constants/tokens";

import Links from "./Links";
import Transaction from "./Transaction";
import Logo from "./Logo";

interface DeadContentProps {
  content: string | undefined;
}

function DeadContent({ content }: DeadContentProps) {
  return (
    <Box
      sx={{
        padding: "14px 16px",
        borderRadius: "8px",
        background: "#4F5A84",
      }}
    >
      <Typography color="text.primary" sx={{ wordBreak: "break-all" }}>
        {content || <Typography height="10px" width="2px" />}
      </Typography>
    </Box>
  );
}

export interface MintProps {
  buttons: { key: string; value: string }[];
  handleChange: (button: ToggleButton) => void;
  active: string;
}

export default function MintCK_ETH({ buttons, handleChange, active }: MintProps) {
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
    <>
      <MainCard>
        <Toggle buttons={buttons} onChange={handleChange} active={active} />

        <Box sx={{ margin: "20px 0 0 0" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Logo type="mint" />

            <Box
              sx={{
                margin: "20px 0 0 0",
                display: "flex",
                gap: "0 10px",
              }}
            >
              <Typography color="#ffffff">
                <Trans>Balance:</Trans>
              </Typography>
              <Typography>
                <Typography color="#ffffff">
                  {ethBalance && !balanceLoading ? toSignificant(ethBalance.toString()) : "--"} ETH
                </Typography>

                <Typography color="#ffffff">
                  {ckETHBalance && !ckBalanceLoading
                    ? toSignificant(parseTokenAmount(ckETHBalance, ckETH.decimals).toString())
                    : "--"}{" "}
                  ckETH
                </Typography>
              </Typography>

              <Box
                sx={{
                  cursor: "pointer",
                }}
                onClick={handelUpdateBalance}
              >
                <RefreshIcon fill="rgb(86, 105, 220)" />
              </Box>
            </Box>

            <Box sx={{ margin: "40px 0 0 0", width: "100%", maxWidth: "474px" }}>
              <Box>
                <Typography>Your wallet of IC network</Typography>
                <Box sx={{ margin: "16px 0 0 0" }}>
                  <DeadContent content={principal} />
                </Box>
              </Box>

              <Box sx={{ margin: "16px 0 0 0" }}>
                <Typography>Principal → Bytes32</Typography>
                <Box sx={{ margin: "16px 0 0 0" }}>
                  <DeadContent content={bytes32} />
                </Box>
              </Box>

              <Box sx={{ margin: "16px 0 0 0" }}>
                <Typography>Your wallet of Metamask</Typography>
                <Box sx={{ margin: "16px 0 0 0" }}>
                  {account ? <DeadContent content={account} /> : <Web3ButtonConnector chainId={chain} />}
                </Box>
              </Box>

              <Box sx={{ margin: "16px 0 0 0" }}>
                <Typography>Transfer ETH (Ethereum Mainnet) amount:</Typography>
                <Box sx={{ margin: "16px 0 0 0" }}>
                  <NumberFilledTextField
                    value={amount}
                    numericProps={{
                      decimalScale: 8,
                      thousandSeparator: true,
                    }}
                    onChange={(value: number) => setAmount(value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ margin: "48px 0 0 0" }}>
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
            </Box>

            <Links />
          </Box>
        </Box>
      </MainCard>

      <Box sx={{ margin: "20px 0 0 0" }}>
        <Transaction blockNumber={blockNumber} />
      </Box>
    </>
  );
}
