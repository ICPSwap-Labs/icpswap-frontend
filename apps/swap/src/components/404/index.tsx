import { Box, Typography } from "components/Mui";
import { ReactComponent as BoundaryErrorImage } from "assets/images/boundary-error.svg";
import { useTranslation } from "react-i18next";
import { Flex } from "@icpswap/ui";

export default function PageNotFound() {
  const { t } = useTranslation();

  return (
    <Box sx={{ width: "100%", height: "calc(100vh - 280px)" }}>
      <Flex align="center" justify="center" sx={{ width: "100%", height: "100%" }}>
        <Box>
          <BoundaryErrorImage />
          <Typography color="text.primary" align="center" sx={{ marginTop: "20px" }}>
            {t("common.page.not.found")}
          </Typography>
        </Box>
      </Flex>
    </Box>
  );
}
