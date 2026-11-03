import { useNodeMachinesOfSubnet, useSubnetBlockRate } from "@icpswap/hooks";
import { Flex, Link } from "@icpswap/ui";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { Box, type BoxProps, Typography, useTheme } from "components/Mui";
import { NetworkStateIcon } from "components/NetworkStateIcon";
import { ICPSwapStableBlockRate, ICPSwapSubnet } from "constants/index";
import { useMemo } from "react";
import { useDesignVersion } from "hooks/useDesignVersion";
import { ArrowUpRight } from "react-feather";
import { useTranslation } from "react-i18next";

export interface SubnetStateProps {
  fullWidth?: boolean;
  wrapperSx?: BoxProps["sx"];
}

export function SubnetState({ fullWidth, wrapperSx }: SubnetStateProps) {
  const { isClassicDesign } = useDesignVersion();
  const { t } = useTranslation();
  const theme = useTheme();

  const { data: nodeMachines } = useNodeMachinesOfSubnet({ subnet: ICPSwapSubnet });
  const { data: subnet } = useSubnetBlockRate({ subnet: ICPSwapSubnet });

  const totalNodeMachines = useMemo(() => {
    if (isUndefinedOrNull(nodeMachines)) return null;
    return nodeMachines.nodes.length;
  }, [nodeMachines]);

  const blockRateLevel = useMemo(() => {
    if (isUndefinedOrNull(subnet)) return null;
    const val = subnet.block_rate[0];
    const block_rate = val ? val[1] : null;
    if (!block_rate) return null;

    const rate = new BigNumber(block_rate).dividedBy(ICPSwapStableBlockRate);

    return rate.isGreaterThan(0.8)
      ? 4
      : rate.isGreaterThan(0.6)
        ? 3
        : rate.isGreaterThan(0.4)
          ? 2
          : rate.isGreaterThan(0.2)
            ? 1
            : 0;
  }, [subnet]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: fullWidth ? "100%" : "1200px",
        position: "absolute",
        bottom: "0px",
        height: isClassicDesign ? "143px" : "80px",
        left: "50%",
        transform: "translate(-50%,0)",
        ...wrapperSx,
      }}
    >
      <Flex fullWidth justify="center" sx={{ height: "100%" }} align="flex-end">
        <Box
          className="border-base-content/8"
          sx={{
            width: fullWidth ? "100%" : "1200px",
            maxWidth: "100%",
            minWidth: 0,
            borderTop: isClassicDesign
              ? `1px solid ${theme.palette.border.level4}`
              : "1px solid color-mix(in oklab, var(--color-base-content) 8%, transparent)",
            padding: isClassicDesign ? "20px 0" : "18px 32px",
            "@media(max-width: 1200px)": {
              padding: "12px",
            },
          }}
        >
          <Flex
            fullWidth
            justify={isClassicDesign ? "flex-end" : "space-between"}
            gap={isClassicDesign ? "0 14px" : "0 20px"}
            sx={{ flexWrap: "wrap", rowGap: "10px" }}
          >
            <Flex gap={isClassicDesign ? "0 5px" : "0 8px"}>
              <Typography
                fontSize={isClassicDesign ? "12px" : "11px"}
                sx={{ lineHeight: "12px", letterSpacing: isClassicDesign ? 0 : "0.02em" }}
              >
                {t("subnet.state", { subnet: ICPSwapSubnet.slice(0, 5) })}
              </Typography>

              {blockRateLevel ? <NetworkStateIcon level={blockRateLevel} /> : null}
            </Flex>

            <Flex gap="0 5px">
              <Typography
                fontSize={isClassicDesign ? "12px" : "11px"}
                sx={{ letterSpacing: isClassicDesign ? 0 : "0.02em" }}
              >
                {t("subnet.node.machines")}
              </Typography>
              <Link link={`https://dashboard.internetcomputer.org/subnet/${ICPSwapSubnet}`}>
                <Flex gap="0 4px">
                  <Typography
                    color="text.primary"
                    fontSize={isClassicDesign ? "12px" : "11px"}
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {totalNodeMachines ?? "--"}
                  </Typography>
                  <ArrowUpRight size={isClassicDesign ? 14 : 12} strokeWidth={2} color={theme.colors.secondary} />
                </Flex>
              </Link>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
