import { Box, Typography, useTheme } from "components/Mui";
import { Flex } from "components/index";
import { ArrowRight } from "react-feather";
import { useTranslation } from "react-i18next";

interface UserLimitOrdersProps {
  onClick: () => void;
}

export function UserLimitPanel({ onClick }: UserLimitOrdersProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box
      mt="8px"
      sx={{
        display: "block",
        width: "100%",
        background: theme.palette.background.level1,
        padding: "24px",
        borderRadius: "16px",
        cursor: "pointer",
      }}
    >
      <Flex justify="space-between" onClick={onClick}>
        <Typography>{t("limit.order.history")}</Typography>
        <ArrowRight size={18} />
      </Flex>
    </Box>
  );
}
