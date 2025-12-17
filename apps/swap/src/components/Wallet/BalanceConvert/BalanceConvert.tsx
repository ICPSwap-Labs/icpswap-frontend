import { DrawerWrapper } from "components/Wallet/DrawerWrapper";
import { useCallback, useMemo } from "react";
import { Box, Typography, Button, Checkbox, CircularProgress } from "components/Mui";
import { Flex, LoadingRow, NoData } from "components/index";
import { useTranslation } from "react-i18next";
import { useWalletContext, WalletManagerPage, ConvertToIcp } from "components/Wallet/context";
import { BigNumber, formatAmount, isUndefinedOrNull, nonUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { useSmallBalanceTokens, SmallBalanceResult } from "hooks/wallet/useSmallBalanceTokens";
import { InfoTokenRealTimeDataResponse } from "@icpswap/types";
import { ICP } from "@icpswap/tokens";
import { useBalanceConvertContext } from "components/Wallet/BalanceConvert/context";

const GREATER_THAN_BALANCE_WOULD_BE_FILTERED = 5;

interface SmallBalanceRowProps {
  amount: BigNumber;
  usdValue: BigNumber;
  infoToken: InfoTokenRealTimeDataResponse;
  icpAmount: bigint;
  onCheckedChange: (checked: boolean, tokenId: string) => void;
  checked: boolean;
}

function SmallBalanceRow({ amount, icpAmount, infoToken, checked, onCheckedChange }: SmallBalanceRowProps) {
  const handleTokenCheck = useCallback(() => {
    onCheckedChange(!checked, infoToken.tokenLedgerId);
  }, [checked, onCheckedChange]);

  return (
    <>
      <Flex justify="space-between" fullWidth sx={{ cursor: "pointer" }} onClick={handleTokenCheck}>
        <Flex gap="0 8px">
          <Checkbox checked={checked} />
          <Typography color="text.primary">{infoToken.tokenSymbol}</Typography>
        </Flex>

        <Box>
          <Typography color="text.primary" align="right">
            {formatAmount(amount.toString())}
          </Typography>
          <Typography sx={{ margin: "6px 0 0 0", fontSize: "12px" }} align="right">
            ≈{formatAmount(parseTokenAmount(icpAmount, ICP.decimals).toString())} ICP
          </Typography>
        </Box>
      </Flex>
    </>
  );
}

export function BalanceConvert() {
  const { t } = useTranslation();
  const { setPages } = useWalletContext();
  const {
    setTokensConvertToIcp,
    convertLoading,
    convertedTokenIds,
    checkedConvertTokenIds,
    setCheckedConvertTokenIds,
  } = useBalanceConvertContext();

  const handlePrev = useCallback(() => {
    setPages(WalletManagerPage.Index);
  }, [setPages]);

  const { result, loading } = useSmallBalanceTokens();

  const smallBalances = useMemo(() => {
    if (isUndefinedOrNull(result)) return undefined;

    const filteredResult = result.filter((element) => {
      const { smallBalanceResult, infoToken, tokenId } = element as {
        tokenId: string;
        smallBalanceResult: SmallBalanceResult;
        infoToken: InfoTokenRealTimeDataResponse;
      };

      const { balance, token } = smallBalanceResult;

      const usdValue = parseTokenAmount(balance, token.decimals).multipliedBy(infoToken.price);

      // The token amount must be greater than twice the token fee to proceed with the swap.
      return (
        usdValue.isLessThan(GREATER_THAN_BALANCE_WOULD_BE_FILTERED) &&
        usdValue.isGreaterThan(0) &&
        !convertedTokenIds.includes(tokenId) &&
        new BigNumber(balance.toString()).isGreaterThan(Number(token.transFee) * 2)
      );
    });

    return filteredResult
      .map((element) => {
        const { smallBalanceResult, infoToken } = element as {
          tokenId: string;
          smallBalanceResult: SmallBalanceResult;
          infoToken: InfoTokenRealTimeDataResponse;
        };

        const amount = parseTokenAmount(smallBalanceResult.balance, smallBalanceResult.token.decimals);
        const usdValue = amount.multipliedBy(infoToken.price);

        return {
          amount,
          usdValue,
          infoToken,
          icpAmount: smallBalanceResult.icpAmount,
          balance: smallBalanceResult.balance,
          poolId: smallBalanceResult.poolId,
          token: smallBalanceResult.token,
        };
      })
      .sort((a, b) => {
        if (a.icpAmount < b.icpAmount) return 1;
        if (a.icpAmount > b.icpAmount) return -1;
        return 0;
      });
  }, [result, convertedTokenIds]);

  const handleTokenChecked = useCallback(
    (checked: boolean, tokenId: string) => {
      if (checked) {
        if (!checkedConvertTokenIds.includes(tokenId)) {
          setCheckedConvertTokenIds([...checkedConvertTokenIds, tokenId]);
        }
        return;
      }

      if (checkedConvertTokenIds.includes(tokenId)) {
        const __checkedTokenIds = [...checkedConvertTokenIds];
        const index = __checkedTokenIds.findIndex((checkedId) => checkedId === tokenId);

        if (index !== -1) {
          __checkedTokenIds.splice(index, 1);
          setCheckedConvertTokenIds(__checkedTokenIds);
        }
      }
    },
    [checkedConvertTokenIds, setCheckedConvertTokenIds],
  );

  const checkedSmallBalances = useMemo(() => {
    if (isUndefinedOrNull(smallBalances)) return undefined;
    return smallBalances.filter(({ infoToken }) => checkedConvertTokenIds.includes(infoToken.tokenLedgerId));
  }, [smallBalances, checkedConvertTokenIds]);

  const checkedSmallBalancesIcpAmount = useMemo(() => {
    if (isUndefinedOrNull(checkedSmallBalances)) return undefined;

    return checkedSmallBalances.reduce((prev, curr) => {
      return prev.plus(curr.icpAmount.toString());
    }, new BigNumber(0));
  }, [checkedSmallBalances]);

  const isSelectedAll = useMemo(() => {
    if (isUndefinedOrNull(smallBalances)) return false;
    return smallBalances.length === checkedConvertTokenIds.length && checkedConvertTokenIds.length !== 0;
  }, [smallBalances, checkedConvertTokenIds]);

  const handleSelectAll = useCallback(() => {
    if (isUndefinedOrNull(smallBalances)) return;

    if (isSelectedAll) {
      setCheckedConvertTokenIds([]);
    } else {
      const allTokenIds = smallBalances.map((element) => element.infoToken.tokenLedgerId);
      setCheckedConvertTokenIds(allTokenIds);
    }
  }, [smallBalances, setCheckedConvertTokenIds, isSelectedAll]);

  const handleConvert = useCallback(() => {
    if (checkedConvertTokenIds.length === 0 || isUndefinedOrNull(checkedSmallBalances)) return;

    const convertToIcp = checkedConvertTokenIds
      .map((tokenId) => {
        const balanceResult = checkedSmallBalances.find((element) => element.infoToken.tokenLedgerId === tokenId);
        if (isUndefinedOrNull(balanceResult)) return undefined;

        return {
          tokenId,
          icpAmount: balanceResult.icpAmount.toString(),
          amount: balanceResult.balance.toString(),
          poolId: balanceResult.poolId,
          token: balanceResult.token,
        };
      })
      .filter((element) => nonUndefinedOrNull(element)) as Array<ConvertToIcp>;

    setTokensConvertToIcp(convertToIcp);
  }, [checkedConvertTokenIds, checkedSmallBalances, setTokensConvertToIcp]);

  return (
    <DrawerWrapper
      padding="12px"
      title={t("wallet.convert.icp.title")}
      onPrev={handlePrev}
      footer={
        nonUndefinedOrNull(result) && result.length > 0 ? (
          <Box sx={{ width: "100%" }}>
            <Flex gap="0 8px" onClick={handleSelectAll}>
              <Checkbox checked={isSelectedAll} />
              <Typography color="text.primary" sx={{ cursor: "pointer", userSelect: "none" }}>
                {t("common.select.all")}
              </Typography>
            </Flex>

            <Flex justify="space-between" sx={{ margin: "20px 0 0 0" }}>
              <Typography>{t("common.will.receive")}</Typography>
              <Typography sx={{ fontSize: "16px", color: "text.primary", fontWeight: 600 }}>
                {checkedSmallBalancesIcpAmount
                  ? formatAmount(parseTokenAmount(checkedSmallBalancesIcpAmount, ICP.decimals).toString())
                  : "0"}{" "}
                {ICP.symbol}
              </Typography>
            </Flex>

            <Box sx={{ margin: "16px 0 0 0" }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleConvert}
                disabled={convertLoading || checkedConvertTokenIds.length === 0}
                startIcon={convertLoading ? <CircularProgress sx={{ color: "inherit" }} size="20px" /> : null}
              >
                {t("common.convert")}
              </Button>
            </Box>
          </Box>
        ) : null
      }
    >
      <Box sx={{ height: "100%", overflow: "auto" }}>
        <Box sx={{ margin: "24px 0 0 0" }}>
          <Typography sx={{ fontSize: "12px", lineHeight: "18px" }}>
            {t("wallet.convert.description", { worth: GREATER_THAN_BALANCE_WOULD_BE_FILTERED })}
          </Typography>
        </Box>

        <Box sx={{ margin: "12px 0 0 0", padding: "0 0 20px 0" }}>
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
            </LoadingRow>
          ) : isUndefinedOrNull(smallBalances) || smallBalances.length === 0 ? (
            <NoData tip="No convertible tokens" />
          ) : (
            <Flex vertical gap="20px 0" fullWidth align="flex-start">
              {smallBalances.map(({ amount, usdValue, infoToken, icpAmount }) => (
                <SmallBalanceRow
                  key={infoToken.tokenLedgerId}
                  amount={amount}
                  usdValue={usdValue}
                  infoToken={infoToken}
                  icpAmount={icpAmount}
                  checked={checkedConvertTokenIds.includes(infoToken.tokenLedgerId)}
                  onCheckedChange={handleTokenChecked}
                />
              ))}
            </Flex>
          )}
        </Box>
      </Box>
    </DrawerWrapper>
  );
}
