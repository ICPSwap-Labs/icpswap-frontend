import { useState } from "react";
import { Button, Box, Grid, Typography, Checkbox, Avatar, useTheme } from "@mui/material";
import { Modal, TextButton } from "components/index";
import { Trans, t } from "@lingui/macro";
import TokenStandardLabel from "components/token/TokenStandardLabel";
import { TOKEN_STANDARD, registerTokens } from "@icpswap/token-adapter";
import { useUpdateTokenStandard, getTokenStandard } from "store/token/cache/hooks";
import { useSuccessTip } from "hooks/useTips";
import { INFO_URL } from "constants/index";
import { useTaggedTokenManager } from "store/wallet/hooks";
import { Theme } from "@mui/material/styles";

import { Verification } from "../types";

export function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_25889_76502)">
        <path
          d="M8.00196 10.9668C8.44927 10.9668 8.82422 11.3417 8.82422 11.7891C8.82422 12.2364 8.44927 12.6113 8.00196 12.6113C7.57109 12.6113 7.1797 12.2364 7.19943 11.8088C7.1797 11.3385 7.55136 10.9668 8.00196 10.9668Z"
          fill="#B79C4A"
        />
        <path
          d="M0.389341 13.8799C-0.127039 12.9885 -0.130329 11.9262 0.382763 11.0381L5.53341 2.11824C6.04321 1.22033 6.96415 0.6875 7.99691 0.6875C9.02967 0.6875 9.9506 1.22361 10.4604 2.11495L15.6176 11.0447C16.1307 11.9426 16.1274 13.0116 15.6078 13.9029C15.0947 14.7844 14.177 15.3139 13.1508 15.3139H2.86271C1.83323 15.3139 0.909011 14.7778 0.389341 13.8799ZM1.50762 13.2352C1.79377 13.7286 2.30028 14.0213 2.86599 14.0213H13.1541C13.7133 14.0213 14.2165 13.7352 14.4961 13.2517C14.7789 12.7616 14.7822 12.1761 14.4994 11.6828L9.34213 2.75631C9.06256 2.26624 8.56263 1.97681 7.99691 1.97681C7.43448 1.97681 6.93126 2.26953 6.65169 2.7596L1.49775 11.6861C1.22147 12.1663 1.22476 12.7451 1.50762 13.2352Z"
          fill="#B79C4A"
        />
        <path
          d="M8.20506 5.19314C8.59645 5.30496 8.83984 5.66018 8.83984 6.09105C8.82011 6.35088 8.80366 6.614 8.78393 6.87384C8.72802 7.86384 8.6721 8.83411 8.61619 9.82411C8.59645 10.1596 8.33662 10.403 8.00114 10.403C7.66565 10.403 7.40253 10.1432 7.38609 9.80438C7.38609 9.60046 7.38608 9.41298 7.36635 9.20577C7.33017 8.57099 7.2907 7.9362 7.25452 7.30141C7.23479 6.89028 7.19861 6.47915 7.17887 6.06802C7.17887 5.92001 7.19861 5.78845 7.25452 5.65689C7.42226 5.28852 7.81366 5.10104 8.20506 5.19314Z"
          fill="#B79C4A"
        />
      </g>
      <defs>
        <clipPath id="clip0_25889_76502">
          <rect width="16" height="16" fill="white" transform="matrix(-1 0 0 1 16 0)" />
        </clipPath>
      </defs>
    </svg>
  );
}

export interface ImportTokenModalProps {
  open: boolean;
  canisterId: string;
  onClose: () => void;
  onImportSuccessfully?: () => void;
  verification: Verification;
}

export function ConfirmImport({
  canisterId,
  open,
  onClose,
  onImportSuccessfully,
  verification,
}: ImportTokenModalProps) {
  const theme = useTheme() as Theme;
  const [riskWarning, setRiskWarning] = useState(false);

  const updateTokenStandard = useUpdateTokenStandard();

  const { updateTaggedTokens } = useTaggedTokenManager();
  const [openSuccessTip] = useSuccessTip();

  const handleConfirm = () => {
    if (!verification) return;

    let __standard = verification.standard;

    // If the imported token support ICRC2, and has no standard registered,
    // make standard is ICRC2 if user import it as icrc1
    if (verification.support_icrc2 && verification.standard === TOKEN_STANDARD.ICRC1 && !getTokenStandard(canisterId)) {
      __standard = TOKEN_STANDARD.ICRC2;
    }

    updateTokenStandard([{ canisterId, standard: __standard }]);
    registerTokens([{ canisterId, standard: __standard }]);
    openSuccessTip(t`Imported successfully`);
    updateTaggedTokens([canisterId]);
    if (onImportSuccessfully) onImportSuccessfully();
    onClose();
  };

  let error = "";
  if (getTokenStandard(canisterId) && getTokenStandard(canisterId) !== verification.standard)
    error = t`Retry after changing token standard.`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t`Import Token`}
      dialogProps={{
        sx: {
          "& .MuiPaper-root": {
            width: "570px",
            maxWidth: "570px",
            background: theme.palette.background.level2,
          },
        },
      }}
    >
      <Box>
        <Grid container sx={{ background: theme.palette.background.level3, padding: "16px", borderRadius: "12px" }}>
          <Avatar sx={{ width: "48px", height: "48px", marginRight: "12px" }} src={verification.metadata.logo ?? ""}>
            &nbsp;
          </Avatar>
          <Grid item xs>
            <Typography fontSize="16px" fontWeight="500" component="span" color="#ffffff">
              {verification.metadata.symbol}({verification.metadata.name})
            </Typography>
            <Typography fontSize="12px" mt="4px">
              {canisterId}
            </Typography>

            <Box mt="8px" sx={{ width: "fit-content" }}>
              <TokenStandardLabel standard={verification.standard} borderRadius="34px" />
            </Box>

            <Box mt="24px">
              <TextButton link={`${INFO_URL}/token/details/${canisterId}?standard=${verification.standard}`}>
                <Trans>View On Info</Trans>
              </TextButton>
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          mt="24px"
          sx={{
            background: "rgba(183, 156, 74, 0.2)",
            border: "1px solid #B79C4A",
            borderRadius: "12px",
            padding: "16px 14px",
          }}
        >
          <Box sx={{ position: "relative", top: "5px" }}>
            <WarningIcon />
          </Box>
          <Grid item xs ml="16px">
            <Typography color="#B79C4A" sx={{ lineHeight: "23px" }}>
              <Trans>
                Anyone can create a token on Internet Computer with any name and LOGO, including creating fake versions
                of existing tokens and tokens that claim to represent projects that do not have a token.
              </Trans>
            </Typography>

            <Typography color="#B79C4A" mt="20px" sx={{ lineHeight: "23px" }}>
              <Trans>
                These risks are always present. If you purchase these fake tokens, it may result in a loss of assets.
                Please DYOR before investing!
              </Trans>
            </Typography>
          </Grid>
        </Grid>

        <Grid container alignItems="center" mt="16px">
          <Checkbox
            checked={riskWarning}
            onChange={({ target: { checked } }) => {
              setRiskWarning(checked);
            }}
            sx={{
              padding: "0",
            }}
          />

          <Grid item xs ml="4px">
            <Typography sx={{ cursor: "pointer", fontSize: "12px" }} onClick={() => setRiskWarning(!riskWarning)}>
              <Trans>I have read the risk warning carefully and agree to take the risk myself</Trans>
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box mt="18px">
        <Button variant="contained" size="large" fullWidth disabled={!!error || !riskWarning} onClick={handleConfirm}>
          {error || <Trans>Confirm</Trans>}
        </Button>
      </Box>
    </Modal>
  );
}
