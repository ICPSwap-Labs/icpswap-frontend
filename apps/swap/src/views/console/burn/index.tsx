import { Box, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import {
  MainCard,
  Breadcrumbs,
  FilledTextField,
  NumberFilledTextField,
  MaxButton,
  AuthButton,
  SelectToken,
} from "components/index";
import { type AllTokenOfSwapTokenInfo, TOKEN_STANDARD } from "@icpswap/types";
import { Trans, t } from "@lingui/macro";
import { useTokenMintingAccount } from "@icpswap/hooks";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useAccountPrincipal } from "store/auth/hooks";
import { useTokenInfo } from "hooks/token";
import { parseTokenAmount, BigNumber } from "@icpswap/utils";
import { CardContent1120 } from "components/Layout/CardContent1120";

import { ConfirmBurnModal } from "./ConfirmBurn";

export default function ConsoleBurn() {
  const principal = useAccountPrincipal();
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [tokenId, setTokenId] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

  const handleTokenChange = (tokenId: string) => {
    setTokenId(tokenId);
  };

  const { result: tokenInfo } = useTokenInfo(tokenId);
  const { result: mintingAccount } = useTokenMintingAccount(tokenId);
  const { result: balance } = useTokenBalance(tokenId, principal, refreshTrigger);

  const handleMax = () => {
    if (!balance || !tokenInfo) return;

    setAmount(parseTokenAmount(balance.minus(tokenInfo.transFee.toString()), tokenInfo.decimals).toString());
  };

  const handleBurnSuccess = () => {
    setAmount("");
    setRefreshTrigger(refreshTrigger + 1);
  };

  const error = useMemo(() => {
    if (!tokenId) return t`Select a token`;
    if (!tokenInfo || !balance || !mintingAccount) return t`Waiting for fetch data`;
    if (!amount) return t`Enter the amount`;
    if (new BigNumber(amount).isEqualTo(0)) return t`Must be greater than 0`;

    if (parseTokenAmount(balance.minus(tokenInfo.transFee.toString()), tokenInfo.decimals).isLessThan(amount))
      return t`Insufficient Balance`;
  }, [amount, balance, tokenInfo, mintingAccount, tokenId]);

  const showMax = useMemo(() => {
    if (!balance || !tokenInfo) return false;
    if (!balance.isGreaterThan(tokenInfo.transFee.toString())) return false;
    return true;
  }, [balance, tokenInfo]);

  return (
    <CardContent1120>
      <Breadcrumbs prevLabel={<Trans>Console</Trans>} prevLink="/console" currentLabel={<Trans>Burn Tool</Trans>} />

      <MainCard sx={{ margin: "16px 0 0 0" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", maxWidth: "474px", padding: "28px 0" }}>
            <Typography sx={{ fontSize: "20px", fontWeight: 700, color: "text.primary" }}>
              <Trans>Confirm Burn</Trans>
            </Typography>

            <Box sx={{ margin: "32px 0 0 0" }}>
              <Box>
                <Typography sx={{ fontSize: "16px" }}>
                  <Trans>Token</Trans>
                </Typography>

                <Box sx={{ margin: "12px 0 0 0" }}>
                  <Box sx={{ height: "48px" }}>
                    <SelectToken
                      value={tokenId}
                      filled
                      search
                      fullHeight
                      onTokenChange={handleTokenChange}
                      filter={(tokenInfo: AllTokenOfSwapTokenInfo) =>
                        tokenInfo.standard !== TOKEN_STANDARD.ICRC1 && tokenInfo.standard !== TOKEN_STANDARD.ICRC2
                      }
                    />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ margin: "24px 0 0 0" }}>
                <Typography sx={{ fontSize: "16px" }}>
                  <Trans>Minting Account</Trans>
                </Typography>

                <Box sx={{ margin: "12px 0 0 0" }}>
                  <FilledTextField border="none" disabled value={mintingAccount?.owner} />
                </Box>
              </Box>

              <Box sx={{ margin: "24px 0 0 0" }}>
                <Typography sx={{ fontSize: "16px" }}>
                  <Trans>Amount</Trans>
                </Typography>

                <Box sx={{ margin: "12px 0 0 0" }}>
                  <NumberFilledTextField
                    value={amount}
                    border="none"
                    onChange={(value: string) => setAmount(value)}
                    numericProps={{
                      thousandSeparator: true,
                      decimalScale: tokenInfo?.decimals ?? 18,
                      allowNegative: false,
                      maxLength: 20,
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ margin: "20px 0 0 0", display: "flex", gap: "0 8px", alignItems: "center" }}>
                <Typography>
                  <Trans>Balance:</Trans>
                  &nbsp;
                  <Typography component="span">
                    {tokenInfo && balance ? parseTokenAmount(balance, tokenInfo.decimals).toFormat() : "--"}
                  </Typography>
                </Typography>
                {showMax ? <MaxButton background="rgba(86, 105, 220, 0.50)" onClick={handleMax} /> : null}
              </Box>

              <Box sx={{ margin: "34px 0 0 0" }}>
                <AuthButton
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => setConfirmModalOpen(true)}
                  disabled={error !== undefined}
                >
                  {error ?? <Trans>Burn</Trans>}
                </AuthButton>
              </Box>
            </Box>
          </Box>
        </Box>

        <ConfirmBurnModal
          token={tokenInfo}
          open={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          mintingAccount={mintingAccount}
          amount={amount}
          onBurnSuccess={handleBurnSuccess}
        />
      </MainCard>
    </CardContent1120>
  );
}
