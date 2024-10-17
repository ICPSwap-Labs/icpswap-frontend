import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Typography, useTheme, Button } from "components/Mui";
import { useSwapPools, useParsedQueryString } from "@icpswap/hooks";
import { useUpdateTokenStandard } from "store/token/cache/hooks";
import { TOKEN_STANDARD } from "constants/tokens";
import { LoadingRow, Flex, Wrapper } from "components/index";
import { Trans } from "@lingui/macro";
import { InfoPools, Positions } from "components/liquidity/index";
import { useHistory } from "react-router-dom";
import { useLoadAddLiquidityCallback } from "hooks/liquidity/index";

enum TabName {
  TopPools = "TopPools",
  Positions = "Positions",
}

const tabs = [
  { label: "Top Pools", value: TabName.TopPools },
  { label: "Your Liquidity Positions", value: TabName.Positions },
];

interface TabProps {
  label: ReactNode;
  value: TabName;
  active?: boolean;
  onClick: (value: TabName) => void;
}

function Tab({ label, value, active, onClick }: TabProps) {
  const theme = useTheme();

  return (
    <Typography
      className={`${active ? "active" : ""}`}
      sx={{
        position: "relative",
        color: active ? "text.primary" : "text.secondary",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: 500,
        lineHeight: "18px",
        "&.active": {
          "&:after": {
            position: "absolute",
            display: "block",
            content: '""',
            width: "100%",
            height: "3px",
            top: "25px",
            background: theme.colors.secondaryMain,
          },
        },
        "@media(max-width: 640px)": {
          fontSize: "16px",
          lineHeight: "16px",
        },
      }}
      onClick={() => onClick(value)}
    >
      {label}
    </Typography>
  );
}

export default function Liquidity() {
  const history = useHistory();
  const { tab } = useParsedQueryString() as { tab: TabName | undefined };

  const [initialTokenStandards, setInitialTokenStandards] = useState(false);

  const { result: pools } = useSwapPools();

  const updateTokenStandards = useUpdateTokenStandard();

  const loadAddLiquidity = useLoadAddLiquidityCallback({ token0: undefined, token1: undefined });

  useEffect(() => {
    async function call() {
      if (!pools) return;

      const allStandards = pools.reduce(
        (prev, curr) => {
          return prev.concat([
            { canisterId: curr.token0.address, standard: curr.token0.standard as TOKEN_STANDARD },
            { canisterId: curr.token1.address, standard: curr.token1.standard as TOKEN_STANDARD },
          ]);
        },
        [] as { canisterId: string; standard: TOKEN_STANDARD }[],
      );

      updateTokenStandards(allStandards);
      setInitialTokenStandards(true);
    }

    if (pools && pools.length > 0 && !initialTokenStandards) {
      call();
    }

    if (pools && pools.length === 0) {
      setInitialTokenStandards(true);
    }
  }, [pools, initialTokenStandards]);

  const handleTab = useCallback(
    (value: TabName) => {
      history.push(`/liquidity?tab=${value}`);
    },
    [history],
  );

  const activeTab = useMemo(() => {
    return tab ?? TabName.TopPools;
  }, [tab]);

  return (
    <Wrapper>
      {!initialTokenStandards ? (
        <LoadingRow>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </LoadingRow>
      ) : (
        <>
          <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "32px" }}>
            <Trans>Liquidity Pools</Trans>
          </Typography>
          <Typography sx={{ fontSize: "16px", margin: "16px 0 0 0", lineHeight: "24px" }}>
            <Trans>Explore the top pools for high-yield opportunities!</Trans>
          </Typography>

          <Flex fullWidth sx={{ margin: "56px 0 0 0" }} justify="space-between">
            <Flex gap="0 33px">
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  label={tab.label}
                  onClick={() => handleTab(tab.value)}
                  active={activeTab === tab.value}
                />
              ))}
            </Flex>

            <Button variant="contained" onClick={loadAddLiquidity}>
              <Trans>Add Liquidity</Trans>
            </Button>
          </Flex>

          <Box sx={{ margin: "35px 0 0 0" }}>
            <Box sx={{ display: activeTab === TabName.TopPools ? "block" : "none" }}>
              <InfoPools />
            </Box>
            <Box sx={{ display: activeTab === TabName.Positions ? "block" : "none" }}>
              <Positions />
            </Box>
          </Box>
        </>
      )}
    </Wrapper>
  );
}
