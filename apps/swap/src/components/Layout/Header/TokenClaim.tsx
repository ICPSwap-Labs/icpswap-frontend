import { useHistory } from "react-router-dom";
import { useState } from "react";
import { t } from "@lingui/macro";
import { ButtonChip } from "components/ButtonChip";
import { Flex } from "components/index";
import { Box, useMediaQuery, useTheme } from "components/Mui";
import { Theme } from "@mui/material/styles";

const READ_CLAIM = "READ_CLAIM";

// function getReadClaim() {
//   const val = window.localStorage.getItem(READ_CLAIM);
//   return val === "true";
// }

function setReadClaim() {
  window.localStorage.setItem(READ_CLAIM, "true");
}

export default function TokenClaim() {
  const history = useHistory();
  const theme = useTheme() as Theme;
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [isRead, setIsRead] = useState(true);

  const handleTokenClaim = () => {
    setReadClaim();
    setIsRead(true);
    history.push("/token-claim");
  };

  // useEffect(() => {
  //   const isRead = getReadClaim();
  //   setIsRead(isRead);
  // }, []);

  return (
    <>
      <Flex gap="0 8px">
        {!matchDownSM && isRead === false ? (
          <Box sx={{ width: "222px", height: "24px" }}>
            <img src="/images/claim.png" alt="" />
          </Box>
        ) : null}

        <Box sx={{ position: "relative" }}>
          <ButtonChip label={t`Claim`} border="primary" onClick={handleTokenClaim} />
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
