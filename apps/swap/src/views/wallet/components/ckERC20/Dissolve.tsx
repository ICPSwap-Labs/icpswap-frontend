import { Box, Button, CircularProgress, Typography, InputAdornment } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { withdraw_eth, useFetchUserTxStates } from "hooks/ck-eth";
import { useApprove, useTokenBalance } from "hooks/token";
import { useAccountPrincipalString } from "store/auth/hooks";
import { ckETH_MINTER_ID, ckETH } from "constants/ckETH";
import { useState, useEffect, useMemo } from "react";
import { FilledTextField, NumberFilledTextField, type Tab } from "components/index";
import { parseTokenAmount, formatTokenAmount, numberToString, toSignificant } from "@icpswap/utils";
import { ResultStatus } from "@icpswap/types";
import { isAddress } from "utils/web3/index";
import { MessageTypes, useTips } from "hooks/useTips";
import { useUpdateUserWithdrawTx } from "store/web3/hooks";
import { useWeb3React } from "@web3-react/core";
import { RefreshIcon } from "assets/icons/Refresh";
import { chainIdToNetwork, chain } from "constants/web3";
import { ERC20Token, Token } from "@icpswap/swap-sdk";

import Logo from "./Logo";
import Links from "./Links";
import DissolveRecords from "./DissolveRecords";
import { MainContent } from "../ckTokens/MainContent";
import { LogosWrapper } from "../ckTokens/LogosWrapper";
import { Wrapper } from "../ckTokens/Wrapper";

export interface DissolveETHProps {
  buttons: { key: string; value: string }[];
  handleChange: (tab: Tab) => void;
  active: string;
  token: Token | undefined;
  erc20Token: ERC20Token | undefined;
}

export default function DissolveCkERC20({ buttons, handleChange, active, token, erc20Token }: DissolveETHProps) {
  const principal = useAccountPrincipalString();
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);

  const { account, chainId } = useWeb3React();

  useEffect(() => {
    if (account) {
      setAddress(account);
    }
  }, [account]);

  const { result: tokenBalance } = useTokenBalance(token?.address, principal, reload);

  const updateUserTx = useUpdateUserWithdrawTx();
  const [openTip] = useTips();
  const approve = useApprove();

  useFetchUserTxStates();

  const handleSubmit = async () => {
    if (!amount || !principal || !token || !address) return;

    const withdraw_amount = BigInt(numberToString(formatTokenAmount(amount, token.decimals)));

    setLoading(true);

    const { status, message } = await approve({
      canisterId: token.address,
      spender: ckETH_MINTER_ID,
      value: withdraw_amount,
      account: principal,
    });

    if (status === ResultStatus.ERROR) {
      openTip(message ?? t`Failed to approve ${token.symbol}`, MessageTypes.error);
      setLoading(false);
      return;
    }

    const { status: status1, message: message1, data } = await withdraw_eth(address, withdraw_amount);

    if (status1 === ResultStatus.ERROR) {
      openTip(message1 ?? t`Transaction for dissolving ${token.symbol} failed to submit`, MessageTypes.error);
    } else {
      setAmount("");
      openTip(t`${token.symbol} dissolution transaction submitted: Awaiting completion.`, MessageTypes.success);
      if (data?.block_index) {
        updateUserTx(principal, data.block_index, undefined, withdraw_amount.toString());
      }
      setReload(!reload);
    }

    setLoading(false);
  };

  const handleMax = () => {
    if (!token) return;
    setAmount(
      parseTokenAmount(tokenBalance, token.decimals)
        .minus(parseTokenAmount(token.transFee, token.decimals))
        .toFixed(token.decimals - 1),
    );
  };

  const error = useMemo(() => {
    if (!!chainId && chain !== chainId) return t`Please switch to ${chainIdToNetwork[chain]}`;
    if (!address) return t`Enter the address`;
    if (isAddress(address) === false) return t`Invalid ethereum address`;
    if (!amount) return t`Enter the amount`;

    if (!token || !tokenBalance) return t`Waiting to fetch data`;

    // if (formatTokenAmount(amount, token.decimals).isLessThan(MIN_WITHDRAW_AMOUNT))
    //   return `Min amount is ${toSignificant(parseTokenAmount(MIN_WITHDRAW_AMOUNT, token.decimals).toString())} ${
    //     token.symbol
    //   }`;

    if (!formatTokenAmount(amount, token.decimals).isGreaterThan(token.transFee))
      return `Min amount is ${toSignificant(parseTokenAmount(token.transFee, token.decimals).toString())} ${
        token.symbol
      }`;

    if (!formatTokenAmount(amount, token.decimals).plus(token.transFee.toString()).isLessThan(tokenBalance))
      return t`Insufficient Balance`;

    return undefined;
  }, [amount, token, tokenBalance, chain, chainId, address]);

  return (
    <Wrapper
      main={
        <MainContent buttons={buttons} onChange={handleChange} active={active}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Box sx={{ width: "100%" }}>
              <Typography color="text.primary" fontSize="16px">
                {token ? <Trans>Transfer {token.symbol} to retrieving account:</Trans> : null}
              </Typography>

              <Typography sx={{ margin: "12px 0 0 0" }} fontSize="16px">
                <Typography component="span" color="#D3625B" fontSize="16px">
                  *
                </Typography>
                <Trans>ETH (Ethereum Mainnet) address:</Trans>
              </Typography>

              <Box sx={{ margin: "12px 0 0 0" }}>
                <FilledTextField
                  value={address}
                  onChange={(value) => setAddress(value)}
                  inputProps={{
                    maxLength: 255,
                  }}
                />
              </Box>

              <Typography sx={{ margin: "24px 0 0 0" }} fontSize="16px">
                <Typography component="span" color="#D3625B" fontSize="16px">
                  *
                </Typography>
                <Trans>Amount: (includes Ethereum network fees)</Trans>
              </Typography>

              <Box sx={{ margin: "12px 0 0 0" }}>
                <NumberFilledTextField
                  value={amount}
                  onChange={(value: number) => setAmount(String(value))}
                  numericProps={{
                    allowNegative: false,
                    decimalScale: 8,
                    maxLength: 26,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <Typography color="text.primary" fontSize="16px">
                          {token?.symbol ?? "--"}
                        </Typography>
                        <Typography
                          color="secondary"
                          sx={{ cursor: "pointer", margin: "0 0 0 5px" }}
                          onClick={handleMax}
                          fontSize="16px"
                        >
                          <Trans>Max</Trans>
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ margin: "5px 0 0 0", display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "12px" }}>
                    Important: Please enter the address of a non-custodial wallet only. Avoid using deposit addresses
                    from centralized exchanges (CEX) like Binance or Coinbase. Using a CEX address could result in the
                    loss of your Ethereum (ETH) in the event of any discrepancies or exceptions.
                  </Typography>
                </Box>

                <Box sx={{ width: "100%", margin: "32px 0 0 0" }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleSubmit}
                    disabled={!!error || loading}
                  >
                    {loading ? <CircularProgress color="inherit" size={22} sx={{ margin: "0 5px 0 0" }} /> : null}
                    {error || <Trans>Dissolve {token?.symbol ?? "--"}</Trans>}
                  </Button>
                </Box>
              </Box>
            </Box>

            <Links ckToken={token} />
          </Box>
        </MainContent>
      }
      logo={
        <LogosWrapper>
          <Logo type="dissolve" token={token} erc20Token={erc20Token} />

          <Box
            sx={{
              margin: "20px 0 0 0",
            }}
          >
            <Box sx={{ display: "flex", gap: "0 10px", alignItems: "center" }}>
              <Typography fontSize="16px">
                <Trans>Balance</Trans>
              </Typography>

              <Box
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => setReload(!reload)}
              >
                <RefreshIcon fill="#ffffff" />
              </Box>
            </Box>

            <Typography color="text.primary" sx={{ margin: "10px 0 0 0", fontSize: "18px", fontWeight: 600 }}>
              {toSignificant(parseTokenAmount(tokenBalance, token?.decimals).toNumber())}
              <Typography component="span" fontSize="16px">
                &nbsp;{token?.symbol ?? "--"}
              </Typography>
            </Typography>
          </Box>
        </LogosWrapper>
      }
      transactions={<DissolveRecords />}
    />
  );
}
