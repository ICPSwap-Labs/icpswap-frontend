import { Box, Typography } from "components/Mui";
import { useState, useMemo } from "react";
import {
  MainCard,
  FilledTextField,
  NumberFilledTextField,
  MaxButton,
  AuthButton,
  SelectToken,
  InfoWrapper,
} from "components/index";
import { type AllTokenOfSwapTokenInfo, TOKEN_STANDARD } from "@icpswap/types";
import { useTokenMintingAccount } from "@icpswap/hooks";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useAccountPrincipal } from "store/auth/hooks";
import { useToken } from "hooks/index";
import { parseTokenAmount, BigNumber } from "@icpswap/utils";
import { BreadcrumbsV1 } from "@icpswap/ui";
import { BurnConfirmModal } from "components/info/tools/BurnConfirm";
import { icrc_standards } from "constants/swap";
import { useTranslation } from "react-i18next";

export default function Burn() {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [tokenId, setTokenId] = useState<string | undefined>(undefined);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

  const handleTokenChange = (tokenId: string) => {
    setTokenId(tokenId);
  };

  const [, token] = useToken(tokenId);
  const { result: mintingAccount } = useTokenMintingAccount(tokenId);
  const { result: balance } = useTokenBalance(tokenId, principal, refreshTrigger);

  const handleMax = () => {
    if (!balance || !token) return;

    setAmount(parseTokenAmount(balance.minus(token.transFee.toString()), token.decimals).toString());
  };

  const handleBurnSuccess = () => {
    setAmount("");
    setRefreshTrigger(refreshTrigger + 1);
  };

  const error = useMemo(() => {
    if (!tokenId) return t("common.select.a.token");
    if (!token || !balance || !mintingAccount) return t("common.waiting.fetching");
    if (!amount) return t("common.enter.input.amount");
    if (new BigNumber(amount).isEqualTo(0)) return t("common.must.greater.than", { symbol: "Amount", amount: "0" });
    if (parseTokenAmount(balance.minus(token.transFee.toString()), token.decimals).isLessThan(amount))
      return t("common.error.insufficient.balance");
  }, [amount, balance, token, mintingAccount, tokenId]);

  const showMax = useMemo(() => {
    if (!balance || !token) return false;
    if (!balance.isGreaterThan(token.transFee.toString())) return false;
    return true;
  }, [balance, token]);

  return (
    <InfoWrapper size="small">
      <BreadcrumbsV1 links={[{ link: "/info-tools", label: t("common.tools") }, { label: t("common.burn") }]} />

      <MainCard sx={{ margin: "16px 0 0 0" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", maxWidth: "474px", padding: "28px 0" }}>
            <Typography sx={{ fontSize: "20px", fontWeight: 700, color: "text.primary" }}>
              {t("common.confirm")}
            </Typography>

            <Box sx={{ margin: "32px 0 0 0" }}>
              <Box>
                <Typography sx={{ fontSize: "16px" }}>{t("common.token")}</Typography>

                <Box sx={{ margin: "12px 0 0 0" }}>
                  <Box sx={{ height: "48px" }}>
                    <SelectToken
                      value={tokenId}
                      filled
                      search
                      fullHeight
                      onTokenChange={handleTokenChange}
                      filter={(tokenInfo: AllTokenOfSwapTokenInfo) =>
                        !icrc_standards.includes(tokenInfo.standard as TOKEN_STANDARD)
                      }
                    />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ margin: "24px 0 0 0" }}>
                <Typography sx={{ fontSize: "16px" }}>{t("tools.minting.account")}</Typography>

                <Box sx={{ margin: "12px 0 0 0" }}>
                  <FilledTextField border="none" disabled value={mintingAccount?.owner} />
                </Box>
              </Box>

              <Box sx={{ margin: "24px 0 0 0" }}>
                <Typography sx={{ fontSize: "16px" }}>{t("common.amount")}</Typography>

                <Box sx={{ margin: "12px 0 0 0" }}>
                  <NumberFilledTextField
                    value={amount}
                    border="none"
                    onChange={(value: string) => setAmount(value)}
                    numericProps={{
                      thousandSeparator: true,
                      decimalScale: token?.decimals ?? 18,
                      allowNegative: false,
                      maxLength: 20,
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ margin: "20px 0 0 0", display: "flex", gap: "0 8px", alignItems: "center" }}>
                <Typography>
                  {t("common.balance.colon.amount", {
                    amount: `${token && balance ? parseTokenAmount(balance, token.decimals).toFormat() : "--"}`,
                  })}
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
                  {error ?? t("common.burn")}
                </AuthButton>
              </Box>
            </Box>
          </Box>
        </Box>

        <BurnConfirmModal
          token={token}
          open={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          mintingAccount={mintingAccount}
          amount={amount}
          onBurnSuccess={handleBurnSuccess}
        />
      </MainCard>
    </InfoWrapper>
  );
}
