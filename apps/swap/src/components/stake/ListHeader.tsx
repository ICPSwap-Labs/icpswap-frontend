import { Box } from "components/Mui";
import { Flex } from "components/index";
import { HeaderCell } from "@icpswap/ui";
import { useTranslation } from "react-i18next";

export interface PoolListHeaderProps {
  showState: boolean;
  gridTemplateColumns: string;
  your: boolean;
  finished: boolean;
  id?: string;
}

export function PoolListHeader({ id, showState, finished, gridTemplateColumns, your }: PoolListHeaderProps) {
  const { t } = useTranslation();

  return (
    <Box
      id={id}
      sx={{
        display: "grid",
        gridTemplateColumns,
        "& .row-item": {
          padding: "16px 0",
          "&:first-of-type": {
            padding: "16px 0 16px 24px",
          },
          "&:last-of-type": {
            padding: "16px 24px 16px 0",
          },
        },
      }}
    >
      <HeaderCell className="row-item">{t("stake.token")}</HeaderCell>
      <HeaderCell className="row-item">{t("common.reward.token")}</HeaderCell>
      <Flex justify="flex-end" className="row-item">
        <HeaderCell>{t("common.apr")}</HeaderCell>
      </Flex>

      {finished ? null : (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>{t("common.your.available.stake")}</HeaderCell>
        </Flex>
      )}

      {your || finished ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>{t("stake.your.staked")}</HeaderCell>
        </Flex>
      ) : null}

      {your ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>{t("common.your.rewards")}</HeaderCell>
        </Flex>
      ) : finished ? null : (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>{t("stake.total.staked")}</HeaderCell>
        </Flex>
      )}

      {finished ? (
        <Flex justify="flex-end" className="row-item">
          <HeaderCell>{t("stake.total.reward.tokens")}</HeaderCell>
        </Flex>
      ) : null}

      {showState ? (
        <Flex justify="flex-end">
          <HeaderCell className="row-item">{t("common.state")}</HeaderCell>
        </Flex>
      ) : null}
    </Box>
  );
}
