import { useState, useCallback, useMemo, useEffect } from "react";
import { Typography, Box, makeStyles, Theme } from "components/Mui";
import { Trans, t } from "@lingui/macro";
import { Flex, TextButton, NumberLabel, Tooltip } from "@icpswap/ui";
import {
  YourPositions,
  StakedPositions,
  UnusedPCMBalance,
  UnclaimedFees,
  SelectPositionState,
  SelectPositionsSort,
} from "components/liquidity/index";
import { FindPositionsModal, Link } from "components/index";
import PositionContext from "components/swap/PositionContext";
import { useAccountPrincipalString } from "store/auth/hooks";
import { formatDollarAmount, BigNumber } from "@icpswap/utils";
import { PositionSort, PositionFilterState, type UserPosition } from "types/swap";
import { useParsedQueryString } from "@icpswap/hooks";
import { Unlock } from "react-feather";

const useStyles = makeStyles((theme: Theme) => {
  return {
    card: {
      background: theme.palette.background.level3,
      borderRadius: "12px",
      padding: "24px",
      "@media(max-width: 640px)": {
        padding: "16px",
      },
    },
    value: {
      fontSize: "24px",
      fontWeight: 500,
      color: theme.palette.text.primary,
      "@media(max-width: 640px)": {
        fontSize: "20px",
      },
    },
    tab: {
      fontSize: "18px",
      fontWeight: 500,
      cursor: "pointer",
      "&.active": {
        color: theme.palette.text.primary,
      },
      "@media(max-width: 640px)": {
        fontSize: "14px",
      },
    },
  };
});

export function Positions() {
  const classes = useStyles();
  const principalString = useAccountPrincipalString();

  const [tab, setTab] = useState<"YOUR" | "STAKED">("YOUR");
  const [findPosition, setFindPosition] = useState(false);
  const [positionSort, setPositionSort] = useState<PositionSort>(PositionSort.Default);
  const [positionFilterState, setPositionFilterState] = useState<PositionFilterState>(PositionFilterState.Default);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [allPositionsUSDKeyValue, setAllPositionsUSDValue] = useState<
    { [id: string]: BigNumber | undefined } | undefined
  >({});
  const [allPositionFees, setAllPositionFees] = useState<{ [id: string]: BigNumber | undefined } | undefined>({});
  const [allPositions, setAllPositions] = useState<UserPosition[] | undefined>(undefined);
  const [allStakedPositions, setAllStakedPositions] = useState<UserPosition[] | undefined>(undefined);
  const [__hiddenNumbers, setHiddenNumbers] = useState<{ [id: string]: boolean }>({});

  const { subTab } = useParsedQueryString() as { subTab: string | undefined };

  const hiddenNumbersOfYourPositions = Object.keys(__hiddenNumbers).filter(
    (key) => key.includes("YOUR") && __hiddenNumbers[key] === true,
  ).length;

  const hiddenNumbersOfStakedPosition = Object.keys(__hiddenNumbers).filter(
    (key) => key.includes("FARM") && __hiddenNumbers[key] === true,
  ).length;

  const allPositionsUSDValue = useMemo(() => {
    if (!allPositionsUSDKeyValue) return undefined;

    return Object.values(allPositionsUSDKeyValue).reduce((prev, curr) => {
      return prev?.plus(curr ?? 0);
    }, new BigNumber(0));
  }, [allPositionsUSDKeyValue]);

  const allPositionFeesUSDValue = useMemo(() => {
    if (!allPositionFees) return undefined;

    return Object.values(allPositionFees).reduce((prev, curr) => {
      return prev?.plus(curr ?? 0);
    }, new BigNumber(0));
  }, [allPositionFees]);

  const handleFindPosition = useCallback(() => {
    setFindPosition(true);
  }, [setFindPosition]);

  const handleAllPositionsUSDValue = useCallback(
    (id: string, usdValue: BigNumber) => {
      setAllPositionsUSDValue((prevState) => ({
        ...prevState,
        [id]: usdValue,
      }));
    },
    [setAllPositionsUSDValue],
  );

  const handleAllPositionFees = useCallback(
    (id: string, usdValue: BigNumber) => {
      setAllPositionFees((prevState) => ({
        ...prevState,
        [id]: usdValue,
      }));
    },
    [setAllPositionFees],
  );

  const handleUpdateRefreshTrigger = useCallback(() => {
    setRefreshTrigger(refreshTrigger + 1);
  }, [refreshTrigger, setRefreshTrigger]);

  const handleSetHiddenNumbers = useCallback(
    (key: string, hidden: boolean) => {
      setHiddenNumbers((prevState) => ({ ...prevState, [key]: hidden }));
    },
    [setHiddenNumbers],
  );

  // reset all positions usd value when account change
  useEffect(() => {
    setAllPositionsUSDValue(undefined);
    setAllPositions(undefined);
    setAllStakedPositions(undefined);
  }, [principalString]);

  useEffect(() => {
    if (subTab === "YOUR" || subTab === "STAKED") {
      setTab(subTab);
    }
  }, [subTab]);

  return (
    <PositionContext.Provider
      value={{
        allPositionsUSDValue: allPositionsUSDKeyValue,
        setAllPositionsUSDValue: handleAllPositionsUSDValue,
        positionFeesValue: allPositionFeesUSDValue,
        positionFees: allPositionFees,
        setPositionFees: handleAllPositionFees,
        refreshTrigger,
        setRefreshTrigger: handleUpdateRefreshTrigger,
        allPositions,
        setAllPositions,
        allStakedPositions,
        setAllStakedPositions,
        setHiddenNumbers: handleSetHiddenNumbers,
      }}
    >
      <Box className={classes.card}>
        <Flex
          gap="0 20px"
          sx={{
            "@media(max-width: 640px)": {
              flexDirection: "column",
              gap: "35px 0",
              alignItems: "flex-start",
            },
          }}
        >
          <Box sx={{ width: "260px" }}>
            <Flex gap="0 4px">
              <Typography>
                <Trans>Total Value</Trans>
              </Typography>
              <Tooltip tips={t`The total value of your liquidity positions`} />
            </Flex>

            <Typography className={classes.value} sx={{ margin: "15px 0 0 0" }}>
              {allPositionsUSDValue ? formatDollarAmount(allPositionsUSDValue.toString()) : "--"}
            </Typography>
          </Box>

          <UnclaimedFees className={classes.value} />

          <UnusedPCMBalance className={classes.value} />
        </Flex>
      </Box>

      <Flex justify="flex-end" sx={{ margin: "32px 0 0 0" }}>
        <Typography component="div">
          <Typography
            component="span"
            sx={{
              color: "text.primary",
              "@media(max-width: 640px)": {
                fontSize: "12px",
              },
            }}
          >
            <Trans>Don't see a pair you joined?</Trans>&nbsp;
          </Typography>
          <TextButton
            onClick={handleFindPosition}
            sx={{
              "@media(max-width: 640px)": {
                fontSize: "12px",
              },
            }}
          >
            <Trans>Find other positions</Trans>
          </TextButton>
        </Typography>
      </Flex>

      <Box className={classes.card} sx={{ margin: "16px 0 0 0" }}>
        <Flex
          justify="space-between"
          align="flex-start"
          sx={{
            "@media(max-width: 640px)": {
              gap: "16px 0",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            },
          }}
        >
          <Flex gap="0 28px">
            <Flex align="center" gap="0 4px">
              <Typography className={`${classes.tab}${tab === "YOUR" ? " active" : ""}`} onClick={() => setTab("YOUR")}>
                <Trans>Your Positions</Trans>
              </Typography>
              <NumberLabel num={allPositions ? allPositions.length - hiddenNumbersOfYourPositions : "--"} />
            </Flex>

            <Flex align="center" gap="0 4px">
              <Typography
                className={`${classes.tab}${tab === "STAKED" ? " active" : ""}`}
                onClick={() => setTab("STAKED")}
              >
                <Trans>Staked Positions</Trans>
              </Typography>

              <NumberLabel num={allStakedPositions?.length ?? "--"} />
            </Flex>
          </Flex>

          <Flex
            gap="0 20px"
            sx={{
              "@media(max-width: 640px)": {
                gap: "0",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              },
            }}
          >
            <Flex gap="0 3px">
              <Typography>
                <Trans>Status:</Trans>
              </Typography>
              <SelectPositionState value={positionFilterState} onChange={setPositionFilterState} />
            </Flex>

            <Flex gap="0 3px">
              <Typography>
                <Trans>Sort by:</Trans>
              </Typography>
              <SelectPositionsSort value={positionSort} onChange={setPositionSort} />
            </Flex>

            <Tooltip
              tips={
                <Box>
                  <Typography
                    sx={{
                      color: "#111936",
                      fontSize: "12px",
                      lineHeight: "18px",
                    }}
                  >
                    <Trans>Need to lock your liquidity? Check out the Sneedlock feature controlled by Sneed DAO:</Trans>
                  </Typography>
                  <Link link="https://xyjos-zqaaa-aaaag-ak7iq-cai.icp0.io/">
                    https://xyjos-zqaaa-aaaag-ak7iq-cai.icp0.io/
                  </Link>
                </Box>
              }
            >
              <Box sx={{ cursor: "pointer" }}>
                <Flex gap="0 3px">
                  <Unlock size={14} />
                  <Typography color="text.primary">
                    <Trans>Liquidity Lock</Trans>
                  </Typography>
                </Flex>
              </Box>
            </Tooltip>
          </Flex>
        </Flex>

        <Box mt="26px">
          <Box sx={{ display: tab === "YOUR" ? "block" : "none" }}>
            <YourPositions
              filterState={positionFilterState}
              sort={positionSort}
              hiddenNumbers={hiddenNumbersOfYourPositions}
            />
          </Box>

          <Box sx={{ display: tab === "STAKED" ? "block" : "none" }}>
            <StakedPositions
              filterState={positionFilterState}
              sort={positionSort}
              hiddenNumbers={hiddenNumbersOfStakedPosition}
            />
          </Box>
        </Box>
      </Box>

      <FindPositionsModal open={findPosition} onClose={() => setFindPosition(false)} />
    </PositionContext.Provider>
  );
}
