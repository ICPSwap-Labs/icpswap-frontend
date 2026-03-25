import { ButtonChip } from "components/ButtonChip";
import { Flex } from "components/index";
import { Box } from "components/Mui";
import { useMediaQuerySM } from "hooks/theme";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const READ_CLAIM = "READ_CLAIM";

function setReadClaim() {
  window.localStorage.setItem(READ_CLAIM, "true");
}

export default function TokenClaim() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const matchDownSM = useMediaQuerySM();
  const [isRead, setIsRead] = useState(true);

  const handleTokenClaim = () => {
    setReadClaim();
    setIsRead(true);
    navigate("/token-claim");
  };

  return (
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
  );
}
