import { useHistory } from "react-router-dom";
import { useCallback, useContext, useMemo, useState } from "react";
import { Box, Typography, Tooltip, useTheme } from "@mui/material";
import { Trans } from "@lingui/macro";
import { ReactComponent as QuestionIcon } from "assets/icons/question.svg";
import { useSwapUserUnusedTokenByPool } from "@icpswap/hooks";
import { swapContext } from "components/swap/index";
import { useAccountPrincipal } from "store/auth/hooks";
import { ReclaimForSinglePool } from "components/swap/ReclaimForSinglePool";
import type { UserSwapPoolsBalance } from "@icpswap/types";
import { Flex } from "@icpswap/ui";
import { ArrowUpRight } from "react-feather";
import { Theme } from "@mui/material/styles";

interface LinkProps {
  fontSize?: "12px" | "14px";
}

function ReclaimLink({ fontSize }: LinkProps) {
  const history = useHistory();

  return (
    <Typography
      component="div"
      sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      onClick={() => history.push("/swap/reclaim")}
    >
      <Typography color="secondary" mr="5px" sx={{ fontSize }}>
        <Trans>Unreceived tokens after swap? Reclaim here</Trans>
      </Typography>

      <Tooltip
        PopperProps={{
          // @ts-ignore
          sx: {
            "& .MuiTooltip-tooltip": {
              background: "#ffffff",
              borderRadius: "8px",
              padding: "12px 16px",
              "& .MuiTooltip-arrow": {
                color: "#ffffff",
              },
            },
          },
        }}
        title={
          <Box>
            <Typography color="text.400" fontSize="14px">
              <Trans>
                For your funds' safety on ICPSwap, we've implemented the 'Reclaim Your Tokens' feature. If issues arise
                with the token canister during swaps, liquidity withdrawals, or fee claims, or if significant slippage
                causes swap failures, utilize this feature to directly reclaim your tokens.
              </Trans>
            </Typography>
          </Box>
        }
        arrow
      >
        <Box sx={{ width: "16px", height: "16px" }}>
          <QuestionIcon />
        </Box>
      </Tooltip>
    </Typography>
  );
}

interface BalancesProps {
  reclaim: UserSwapPoolsBalance;
  index: number;
  onReclaimSuccess?: () => void;
}

function Balances({ reclaim, onReclaimSuccess }: BalancesProps) {
  return (
    <>
      {reclaim.balance0 !== BigInt(0) ? (
        <ReclaimForSinglePool
          id={`balance0_${reclaim.canisterId.toString()}_${reclaim.type}`}
          poolId={reclaim.canisterId.toString()}
          balance={reclaim.balance0}
          tokenId={reclaim.token0.address}
          type={reclaim.type}
          onReclaimSuccess={onReclaimSuccess}
        />
      ) : null}

      {reclaim.balance1 !== BigInt(0) ? (
        <ReclaimForSinglePool
          id={`balance1_${reclaim.canisterId.toString()}_${reclaim.type}`}
          poolId={reclaim.canisterId.toString()}
          balance={reclaim.balance1}
          tokenId={reclaim.token1.address}
          type={reclaim.type}
          onReclaimSuccess={onReclaimSuccess}
        />
      ) : null}
    </>
  );
}

export interface ReclaimLinkProps {
  fontSize?: "12px" | "14px";
}

export function Reclaim({ fontSize = "14px" }: ReclaimLinkProps) {
  const history = useHistory();
  const theme = useTheme() as Theme;
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const { selectedPool, unavailableBalanceKeys } = useContext(swapContext);
  const principal = useAccountPrincipal();
  const { balances } = useSwapUserUnusedTokenByPool(selectedPool, principal, refreshTrigger);

  const __balances = useMemo(() => {
    return balances.filter((e) => !(e.balance0 === BigInt(0) && e.balance1 === BigInt(0)));
  }, [balances]);

  const balanceNumber = useMemo(() => {
    let number = 0;

    for (let i = 0; i < balances.length; i++) {
      const e = balances[i];

      if (e.balance0 !== BigInt(0)) {
        number += 1;
      }

      if (e.balance1 !== BigInt(0)) {
        number += 1;
      }
    }

    return number;
  }, [balances]);

  const handleClaimSuccess = useCallback(() => {
    setRefreshTrigger(refreshTrigger + 1);
  }, [refreshTrigger]);

  const handleViewAll = useCallback(() => {
    history.push("/swap/reclaim");
  }, [history]);

  return (
    <Box>
      {balanceNumber !== 0 && unavailableBalanceKeys.length !== balanceNumber ? (
        <Flex sx={{ width: "100%" }} justify="space-between" align="flex-start">
          <Box>
            {__balances.map((e, index) => (
              <Balances index={index} key={e.canisterId.toString()} reclaim={e} onReclaimSuccess={handleClaimSuccess} />
            ))}
          </Box>

          <Flex gap="0 8px" sx={{ cursor: "pointer", width: "fit-content" }} onClick={handleViewAll}>
            <Typography color="secondary">
              <Trans>View All</Trans>
            </Typography>
            <ArrowUpRight color={theme.colors.secondaryMain} size="16px" />
          </Flex>
        </Flex>
      ) : (
        <ReclaimLink fontSize={fontSize} />
      )}
    </Box>
  );
}
