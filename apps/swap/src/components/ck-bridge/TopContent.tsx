import { Flex, TextButton, Tooltip } from "@icpswap/ui";
import { Typography } from "components/Mui";
import { useTranslation } from "react-i18next";

export function TopContent() {
  const { t } = useTranslation();

  return (
    <Flex gap="0 8px">
      <Typography sx={{ color: "text.primary", fontWeight: 500, fontSize: "32px" }}>ck-Bridge</Typography>

      <Tooltip
        tips={
          <Typography component="div">
            <Typography
              sx={{
                color: "#111936",
                fontSize: "12px",
                lineHeight: "18px",
              }}
              component="span"
            >
              {t("ck.description")}
            </Typography>
            &nbsp;
            <TextButton
              sx={{
                fontSize: "12px",
                color: "text.theme-secondary",
                textDecoration: "underline",
              }}
              link="https://internetcomputer.org/docs/current/developer-docs/smart-contracts/signatures/t-ecdsa"
            >
              {t("common.view.all")}
            </TextButton>
          </Typography>
        }
      />
    </Flex>
  );
}
