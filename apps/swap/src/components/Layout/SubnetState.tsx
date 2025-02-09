import { useTheme, Box, Typography, BoxProps } from "components/Mui";
import { Flex, Link } from "@icpswap/ui";
import { useSubnetBlockRate, useNodeMachinesOfSubnet } from "@icpswap/hooks";
import { useMemo } from "react";
import { BigNumber, isNullArgs } from "@icpswap/utils";
import { ArrowUpRight } from "react-feather";
import { ICPSwapSubnet, ICPSwapStableBlockRate } from "constants/index";
import { NetworkStateIcon } from "components/NetworkStateIcon";
import { useTranslation } from "react-i18next";

export interface SubnetStateProps {
  fullWidth?: boolean;
  wrapperSx?: BoxProps["sx"];
}

export function SubnetState({ fullWidth, wrapperSx }: SubnetStateProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const { result: nodeMachines } = useNodeMachinesOfSubnet({ subnet: ICPSwapSubnet });
  const { result: subnet } = useSubnetBlockRate({ subnet: ICPSwapSubnet });

  const totalNodeMachines = useMemo(() => {
    if (isNullArgs(nodeMachines)) return null;
    return nodeMachines.nodes.length;
  }, [nodeMachines]);

  const blockRateLevel = useMemo(() => {
    if (isNullArgs(subnet)) return null;
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
        height: `${90 + 53}px`,
        left: "50%",
        transform: "translate(-50%,0)",
        ...wrapperSx,
      }}
    >
      <Flex fullWidth justify="center" sx={{ height: "100%" }} align="flex-end">
        <Box
          sx={{
            width: fullWidth ? "100%" : "1200px",
            borderTop: `1px solid ${theme.palette.border.level4}`,
            padding: "20px 0",
            "@media(max-width: 1200px)": {
              padding: "12px",
            },
          }}
        >
          <Flex fullWidth justify="flex-end" gap="0 14px">
            <Flex gap="0 5px">
              <Typography fontSize="12px" sx={{ lineHeight: "12px" }}>
                {t("subnet.state", { subnet: ICPSwapSubnet.slice(0, 5) })}
              </Typography>

              {blockRateLevel ? <NetworkStateIcon level={blockRateLevel} /> : null}
            </Flex>

            <Flex gap="0 5px">
              <Typography fontSize="12px">{t("subnet.node.machines")}</Typography>
              <Link link={`https://dashboard.internetcomputer.org/subnet/${ICPSwapSubnet}`}>
                <Flex gap="0 4px">
                  <Typography color="text.primary" fontSize="12px">
                    {totalNodeMachines ?? "--"}
                  </Typography>
                  <ArrowUpRight size={14} strokeWidth={2} color={theme.colors.secondary} />
                </Flex>
              </Link>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
