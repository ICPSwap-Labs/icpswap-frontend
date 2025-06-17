import { Box, BoxProps } from "components/Mui";
import { Flex } from "components/index";
import { HeaderCell } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

interface FarmListHeaderProps {
  showState: boolean;
  state: "NOT_STARTED" | "LIVE" | "FINISHED" | undefined;
  sx?: BoxProps["sx"];
  your: boolean;
  id?: string;
}

export function FarmListHeader({ id, your, state, showState, sx }: FarmListHeaderProps) {
  const { t } = useTranslation();

  return (
    <Box
      id={id}
      sx={{
        display: "grid",
        "& .row-item": {
          padding: "16px 0",
          "&:first-of-type": {
            padding: "16px 0 16px 24px",
          },
          "&:last-of-type": {
            padding: "16px 24px 16px 0",
          },
        },
        ...sx,
      }}
    >
      <HeaderCell className="row-item">{t("farm.staked.position")}</HeaderCell>
      <HeaderCell className="row-item">{t("common.reward.token")}</HeaderCell>
      <Flex justify="flex-end" className="row-item">
        <HeaderCell>{t("common.apr")}</HeaderCell>
      </Flex>

      {state !== "FINISHED" ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>{t("common.your.available.stake")}</HeaderCell>
        </Flex>
      ) : null}

      {your ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>{t("common.your.rewards")}</HeaderCell>
        </Flex>
      ) : null}

      {your || state === "FINISHED" ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>{t("stake.your.staked")}</HeaderCell>
        </Flex>
      ) : null}

      {!your && state !== "FINISHED" ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>{t("stake.total.staked")}</HeaderCell>
        </Flex>
      ) : null}

      {state === "FINISHED" ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>{t("stake.total.reward.tokens")}</HeaderCell>
        </Flex>
      ) : null}

      {showState ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>{t("common.state")}</HeaderCell>
        </Flex>
      ) : null}
    </Box>
  );
}
