import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ButtonChip } from "components/ButtonChip";
import { Flex } from "components/index";
import { Box, useMediaQuery, useTheme } from "components/Mui";
import { useTranslation } from "react-i18next";

const READ_CLAIM = "READ_CLAIM";

function setReadClaim() {
  window.localStorage.setItem(READ_CLAIM, "true");
}

export default function TokenClaim() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [isRead, setIsRead] = useState(true);

  const handleTokenClaim = () => {
    setReadClaim();
    setIsRead(true);
    navigate("/token-claim");
  };

  return (
    <>
      <Flex gap="0 8px">
        {!matchDownSM && isRead === false ? (
          <Box sx={{ width: "222px", height: "24px" }}>
            <img src="/images/claim.png" alt="" />
          </Box>
        ) : null}

        <Box sx={{ position: "relative" }}>
          <ButtonChip label={t("common.claim")} border="primary" onClick={handleTokenClaim} />
          {matchDownSM && isRead === false ? (
            <Box
              sx={{
                position: "absolute",
                bottom: "calc(-100% - 3px)",
                left: "50%",
                transform: "translate(-50%, 0)",
                width: "222px",
                height: "30px",
              }}
            >
              <img src="/images/claim-mobile.png" alt="" />
            </Box>
          ) : null}
        </Box>
      </Flex>
    </>
  );
}
