import { Box, Button, CircularProgress, Typography, InputAdornment } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { useTokenBalance } from "hooks/token";
import { useAccountPrincipalString } from "store/auth/hooks";
import { useState, useEffect, useMemo } from "react";
import { FilledTextField, NumberFilledTextField, type Tab } from "components/index";
import { parseTokenAmount, formatTokenAmount, toSignificant } from "@icpswap/utils";
import { ResultStatus, Erc20MinterInfo } from "@icpswap/types";
import { isAddress } from "utils/web3/index";
import { useWeb3React } from "@web3-react/core";
import { RefreshIcon } from "assets/icons/Refresh";
import { chainIdToNetwork, chain } from "constants/web3";
import { ERC20Token, Token } from "@icpswap/swap-sdk";
import { useDissolveCkERC20 } from "hooks/ckERC20/index";

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
  minterInfo: Erc20MinterInfo | undefined;
}

export default function DissolveCkERC20({
  buttons,
  handleChange,
  active,
  token,
  erc20Token,
  minterInfo,
}: DissolveETHProps) {
  const principal = useAccountPrincipalString();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);

  const { account, chainId } = useWeb3React();

  useEffect(() => {
    if (account) {
      setAddress(account);
    }
  }, [account]);

  const { result: tokenBalance } = useTokenBalance(token?.address, principal, refreshTrigger);

  const helperContractAddress = useMemo(() => {
    if (!minterInfo) return undefined;
    return minterInfo.erc20_helper_contract_address[0];
  }, [minterInfo]);

  const dissolveErc20 = useDissolveCkERC20();

  const handleSubmit = async () => {
    if (!amount || !principal || !token || !address) return;

    setLoading(true);

    const withdrawResult = await dissolveErc20(token, amount, address);

    if (withdrawResult?.status === ResultStatus.OK) {
      setRefreshTrigger(refreshTrigger + 1);
      setAmount("");
    }

    setLoading(false);
  };

  const handleMax = () => {
    if (!token) return;
    setAmount(
      // parseTokenAmount(tokenBalance, token.decimals)
      //   .minus(parseTokenAmount(token.transFee, token.decimals))
      //   .toFixed(token.decimals - 1),
      parseTokenAmount(tokenBalance, token.decimals).minus(parseTokenAmount(token.transFee, token.decimals)).toString(),
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

    if (formatTokenAmount(amount, token.decimals).isGreaterThan(tokenBalance)) return t`Insufficient Balance`;

    return undefined;
  }, [amount, token, tokenBalance, chain, chainId, address]);

  // Refresh dissolve records each 20s
  useEffect(() => {
    let timer: NodeJS.Timeout | null = setInterval(() => {
      setRefreshTrigger(refreshTrigger + 1);
    }, 60000);

    return () => {
      if (timer !== null) {
        clearInterval(timer);
      }

      timer = null;
    };
  }, [refreshTrigger]);

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
                  placeholder={t`Enter the address`}
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
                  placeholder="0.00"
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

            <Links ckToken={token} helperContract={helperContractAddress} />
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
                onClick={() => setRefreshTrigger(refreshTrigger + 1)}
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
      transactions={<DissolveRecords refresh={refreshTrigger} />}
    />
  );
}
