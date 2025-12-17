import React, { useMemo, useEffect, useCallback } from "react";
import { useTheme, Typography, Box, useMediaQuery } from "components/Mui";
import { useTokenBalance } from "hooks/token/useTokenBalance";
import { DotLoading, Flex, TokenImage } from "components/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { useUSDPriceById } from "hooks/useUSDPrice";
import {
  parseTokenAmount,
  formatDollarAmount,
  BigNumber,
  isValidPrincipal,
  formatAmount,
  nonUndefinedOrNull,
} from "@icpswap/utils";
import { Image } from "@icpswap/ui";
import { PlusCircle } from "react-feather";
import { useTaggedTokenManager, useSortedTokensManager } from "store/wallet/hooks";
import { Token } from "@icpswap/swap-sdk";
import { useToken } from "hooks/index";

export interface TokenItemProps {
  canisterId: string;
  onClick?: (token: Token) => void;
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

  const [, token] = useToken(canisterId);
  const { result: balance, loading } = useTokenBalance(getBalanceId, principal);
  const interfacePrice = useUSDPriceById(getBalanceId);

  const { taggedTokens, updateTaggedTokens, deleteTaggedTokens } = useTaggedTokenManager();
  const [sortedTokens, updateSortedTokens, removeSortedTokens] = useSortedTokensManager();

  const tokenBalanceAmount = useMemo(() => {
    if (!token || balance === undefined) return undefined;
    return parseTokenAmount(balance, token.decimals).toString();
  }, [token, balance]);

  const handleItemClick = () => {
    if (!token) return;
    if (onClick) onClick(token);
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
    if (!token) return true;

    if (isValidPrincipal(searchWord)) {
      return token?.address !== searchWord;
    }

    return (
      !token.symbol.toLocaleLowerCase().includes(searchWord.toLocaleLowerCase()) &&
      !token.name.toLocaleLowerCase().includes(searchWord.toLocaleLowerCase())
    );
  }, [searchWord, token, hidden]);

  useEffect(() => {
    if (onTokenHide && canisterId) {
      onTokenHide(canisterId, isHidden);
    }
  }, [isHidden, canisterId, onTokenHide]);

  const handleSortedToken = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      updateSortedTokens([canisterId]);
    },
    [updateSortedTokens, canisterId],
  );

  const handleRemoveSortedToken = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      removeSortedTokens([canisterId]);
    },
    [removeSortedTokens, canisterId],
  );

  return (
    <Box
      sx={{
        display: isHidden ? "none" : "grid",
        height: "63px",
        cursor: "pointer",
        padding: matchDownSM ? "0 16px" : "0 24px",
        gridTemplateColumns: "198px 1fr",
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
        <Flex fullWidth gap="0 12px">
          <TokenImage logo={token?.logo} size={matchDownSM ? "18px" : "40px"} tokenId={token?.address} />

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
              {token?.symbol}
            </Typography>
            <Typography
              fontSize="12px"
              sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: "4px 0 0 0" }}
            >
              {token?.name}
            </Typography>
          </Box>
        </Flex>
      </Box>

      <Box>
        <Flex fullWidth justify="flex-end" align="center" gap="0 12px">
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
                {tokenBalanceAmount ? formatAmount(tokenBalanceAmount) : "--"}
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
                {nonUndefinedOrNull(interfacePrice) && nonUndefinedOrNull(balance) && nonUndefinedOrNull(token)
                  ? formatDollarAmount(
                      new BigNumber(interfacePrice).multipliedBy(parseTokenAmount(balance, token.decimals)).toString(),
                    )
                  : "--"}
              </Typography>
            </Box>
          )}

          {showBalance || isTagged ? null : (
            <PlusCircle color={theme.themeOption.textSecondary} size="16px" onClick={handleAddToCache} />
          )}

          {!showBalance ? null : sortedTokens.includes(canisterId) ? (
            <Image
              src="/images/icon-tagged.svg"
              sx={{ width: "16px", height: "16px", cursor: "pointer" }}
              onClick={handleRemoveSortedToken}
            />
          ) : (
            <Image
              src="/images/icon-un-tagged.svg"
              sx={{ width: "16px", height: "16px", cursor: "pointer" }}
              onClick={handleSortedToken}
            />
          )}
        </Flex>
      </Box>
    </Box>
  );
}
