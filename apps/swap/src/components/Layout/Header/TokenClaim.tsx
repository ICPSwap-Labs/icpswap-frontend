import { useHistory } from "react-router-dom";
import { useTheme, Box } from "@mui/material";
import { t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { ButtonChip } from "components/ButtonChip";

export default function TokenClaim() {
  const theme = useTheme() as Theme;
  const history = useHistory();

  const handleTokenClaim = () => {
    history.push("/token-claim");
  };

  return (
    <>
      <Box
        component="span"
        sx={{
          marginLeft: "16px",
          [theme.breakpoints.down("sm")]: {
            marginLeft: "8px",
          },
        }}
      >
        <ButtonChip label={t`Claim`} border="primary" onClick={handleTokenClaim} />
      </Box>
    </>
  );
}
