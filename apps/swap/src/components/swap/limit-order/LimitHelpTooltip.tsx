import { Tooltip, Flex, Link } from "@icpswap/ui";
import { Typography, useTheme } from "components/Mui";
import { useTranslation } from "react-i18next";

export function LimitHelpTooltip() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Flex
        sx={{
          width: "32px",
          height: "32px",
          cursor: "pointer",
          borderRadius: "40px",
          background: theme.palette.background.level2,
        }}
        justify="center"
      >
        <Tooltip
          iconColor="#ffffff"
          tips={
            <Flex vertical align="flex-start" gap="5px 0">
              <Typography className="tooltip-typography">{t("swap.help.tooltip0")}</Typography>
              <Typography className="tooltip-typography">{t("swap.help.tooltip1")}</Typography>
              <Link link="https://iloveics.gitbook.io/icpswap/products/limit-order">
                <Typography
                  sx={{ color: theme.colors.secondaryMain, fontWeight: 500, lineHeight: "18px", fontSize: "12px" }}
                >
                  {t("swap.help.tooltip2")}
                </Typography>
              </Link>
            </Flex>
          }
        />
      </Flex>
    </>
  );
}
