import React, { useMemo, useEffect } from "react";
import { useTheme, Typography, Box, Grid, useMediaQuery } from "components/Mui";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { useTokenInfo } from "hooks/token/useTokenInfo";
import { DotLoading, TokenImage, TokenStandardLabel } from "components/index";
import { TokenInfo } from "types/token";
import { useAccountPrincipal } from "store/auth/hooks";
import { useUSDPriceById } from "hooks/useUSDPrice";
import {
  parseTokenAmount,
  formatDollarAmount,
  BigNumber,
  isValidPrincipal,
  toSignificantWithGroupSeparator,
} from "@icpswap/utils";
import { PlusCircle } from "react-feather";
import { useTaggedTokenManager } from "store/wallet/hooks";

export interface TokenItemProps {
  canisterId: string;
  onClick?: (token: TokenInfo) => void;
  onUpdateTokenAdditional?: (tokenId: string, balance: string) => void;
  searchWord?: string;
  showBalance?: boolean;
  onTokenHide: (canisterId: string, hidden: boolean) => void;
  isActive?: boolean;
  isDisabled?: boolean;
  hidden?: boolean;
}

export function TokenItem({
  canisterId,
  onClick,
  onUpdateTokenAdditional,
  searchWord,
  showBalance,
  onTokenHide,
  isActive,
  isDisabled,
  hidden,
}: TokenItemProps) {
  const theme = useTheme();
  const principal = useAccountPrincipal();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const getBalanceId = useMemo(() => {
    if (showBalance) return canisterId;
    return undefined;
  }, [showBalance, canisterId]);

  const { result: tokenInfo } = useTokenInfo(canisterId);
  const { result: balance, loading } = useTokenBalance(getBalanceId, principal);
  const interfacePrice = useUSDPriceById(getBalanceId);

  const { taggedTokens, updateTaggedTokens, deleteTaggedTokens } = useTaggedTokenManager();

  const tokenBalanceAmount = useMemo(() => {
    if (!tokenInfo || balance === undefined) return undefined;
    return toSignificantWithGroupSeparator(parseTokenAmount(balance, tokenInfo.decimals).toString(), 6);
  }, [tokenInfo, balance]);

  const handleItemClick = () => {
    if (!tokenInfo) return;
    if (onClick) onClick(tokenInfo);
  };

  useEffect(() => {
    if (canisterId && balance) {
      if (onUpdateTokenAdditional) onUpdateTokenAdditional(canisterId, balance.toString());
    }
  }, [canisterId, balance]);

  const isTagged = taggedTokens.includes(canisterId);

  const handleAddToCache = (event: React.MouseEvent<SVGAElement>) => {
    event.stopPropagation();

    if (isTagged) {
      deleteTaggedTokens([canisterId]);
    } else {
      updateTaggedTokens([canisterId]);
    }
  };

  const isHidden = useMemo(() => {
    if (hidden) return true;
    if (!searchWord) return false;
    if (!tokenInfo) return true;

    if (isValidPrincipal(searchWord)) {
      return tokenInfo?.canisterId.toString() !== searchWord;
    }

    return (
      !tokenInfo.symbol.toLocaleLowerCase().includes(searchWord.toLocaleLowerCase()) &&
      !tokenInfo.name.toLocaleLowerCase().includes(searchWord.toLocaleLowerCase())
    );
  }, [searchWord, tokenInfo, hidden]);

  useEffect(() => {
    if (onTokenHide && canisterId) {
      onTokenHide(canisterId, isHidden);
    }
  }, [isHidden, canisterId, onTokenHide]);

  return (
    <Box
      sx={{
        display: isHidden ? "none" : "grid",
        height: "63px",
        cursor: "pointer",
        padding: matchDownSM ? "0 16px" : "0 24px",
        gridTemplateColumns: "198px 50px 1fr",
        gap: "0 5px",
        alignItems: "center",
        "&.disabled": {
          opacity: 0.5,
          cursor: "default",
        },
        "&.active": {
          background: theme.palette.background.level4,
          cursor: "default",
        },
        "&:hover": {
          background: theme.palette.background.level4,
        },
        "@media (max-width: 580px)": {
          gridTemplateColumns: "115px 50px 1fr",
        },
      }}
      onClick={handleItemClick}
      className={`${isDisabled ? "disabled" : ""}${isActive ? " active" : ""}`}
    >
      <Box>
        <Grid container alignItems="center" gap="0 12px">
          <TokenImage logo={tokenInfo?.logo} size={matchDownSM ? "18px" : "40px"} tokenId={tokenInfo?.canisterId} />

          <Grid item xs sx={{ overflow: "hidden" }}>
            <Grid container alignItems="center">
              <Box sx={{ width: "100%" }}>
                <Typography
                  color="text.primary"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "16px",
                    fontWeight: 500,
                    "@media (max-width: 580px)": {
                      fontSize: "14px",
                    },
                  }}
                >
                  {tokenInfo?.symbol}
                </Typography>
                <Typography
                  fontSize="12px"
                  sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: "4px 0 0 0" }}
                >
                  {tokenInfo?.name}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <TokenStandardLabel standard={tokenInfo?.standardType} borderRadius="34px" height="20px" fontSize="10px" />
      </Box>

      <Box>
        <Grid container justifyContent="flex-end" alignItems="center">
          {!showBalance ? null : loading ? (
            <DotLoading loading />
          ) : (
            <Box>
              <Typography
                color="text.primary"
                align="right"
                sx={{
                  maxWidth: "10rem",
                  fontSize: "16px",
                  "@media (max-width: 580px)": {
                    fontSize: "14px",
                  },
                }}
                fontWeight={500}
              >
                {tokenBalanceAmount ?? "--"}
              </Typography>
              <Typography
                align="right"
                sx={{
                  margin: "4px 0 0 0",
                  "@media (max-width: 580px)": {
                    fontSize: "12px",
                  },
                }}
              >
                {interfacePrice !== undefined && balance !== undefined && tokenInfo !== undefined
                  ? formatDollarAmount(
                      new BigNumber(interfacePrice)
                        .multipliedBy(parseTokenAmount(balance, tokenInfo.decimals))
                        .toString(),
                      { digits: 4 },
                    )
                  : "--"}
              </Typography>
            </Box>
          )}

          {showBalance || isTagged ? null : (
            <PlusCircle color={theme.themeOption.textSecondary} size="16px" onClick={handleAddToCache} />
          )}
        </Grid>
      </Box>
    </Box>
  );
}
