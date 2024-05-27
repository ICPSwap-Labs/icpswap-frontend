import { useTheme, Typography, Box, Button, CircularProgress } from "@mui/material";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { TOKEN_STANDARD, tokenStandardVerification } from "@icpswap/token-adapter";
import { useState } from "react";
import { SelectTokenStandard } from "components/Select/SelectTokenStandard";

import { Verification } from "../types";

export interface ChooseStandardProps {
  canisterId: string;
  onNext: (verification: Verification) => void;
}

export function ChooseStandardAndVerify({ canisterId, onNext }: ChooseStandardProps) {
  const theme = useTheme() as Theme;

  const [loading, setLoading] = useState(false);
  const [checkFailed, setCheckFailed] = useState(false);

  const [standard, setStandard] = useState<TOKEN_STANDARD>(TOKEN_STANDARD.ICRC1);

  const handleStandardChange = (standard: TOKEN_STANDARD) => {
    setLoading(false);
    setCheckFailed(false);
    setStandard(standard);
  };

  const handleNext = async () => {
    setLoading(true);
    setCheckFailed(false);

    const { valid, metadata, support_icrc2 } = await tokenStandardVerification(canisterId, standard);

    setLoading(false);

    if (!valid || !metadata) {
      setCheckFailed(true);
      return;
    }

    onNext({
      valid,
      metadata,
      support_icrc2,
      standard,
      canisterId,
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "12px",
        background: theme.palette.background.level4,
        padding: "24px",
      }}
    >
      <Typography align="center">
        <Trans>Please select the token standard first</Trans>
      </Typography>

      {checkFailed ? (
        <Typography sx={{ fontSize: "12px", color: "text.warning", margin: "8px 0", textAlign: "center" }}>
          <Trans>This canister id did not match the token standard "{standard}"</Trans>
        </Typography>
      ) : null}

      <Box mt="16px" sx={{ display: "flex", justifyContent: "center", gap: "0 20px" }}>
        <SelectTokenStandard value={standard} onChange={handleStandardChange} showClean={false} />
      </Box>

      <Box mt="16px" sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          sx={{ width: "280px" }}
          size="large"
          variant="contained"
          onClick={handleNext}
          disabled={loading}
          startIcon={loading ? <CircularProgress color="inherit" size={24} /> : null}
        >
          <Trans>Next</Trans>
        </Button>
      </Box>
    </Box>
  );
}
