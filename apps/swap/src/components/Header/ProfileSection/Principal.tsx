import { useRef } from "react";
import { makeStyles, useTheme } from "@mui/styles";
import { Box, Typography, SvgIcon } from "@mui/material";
import Copy, { CopyRef } from "components/Copy";
import { mockALinkToOpen, principalToAccount } from "@icpswap/utils";
import { getExplorerAccountLink } from "utils/index";
import { Trans } from "@lingui/macro";
import { useAccountPrincipalString } from "store/auth/hooks";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles(() => ({
  wrapper: {
    wordBreak: "break-all",
    padding: "12px",
    textAlign: "left",
    border: "1px solid #EFEFFF",
    borderRadius: "8px",
  },
  label: {
    padding: "3px 6px",
    background: "#EFEFFF",
    borderRadius: "30px",
    color: "#111936",
    fontSize: "10px",
  },
}));

export function LoadToExplorerIcon(props: any) {
  return (
    <SvgIcon viewBox="0 0 15 14" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 0H6V2H2V12H12V8H14V14H0V0Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.7865 2H8.40071V0H13.0033H14.0033V1V5.60261H12.0033V3.6116L5.81851 9.79641L4.4043 8.3822L10.7865 2Z"
      />
    </SvgIcon>
  );
}

export default function ProfileSection() {
  const classes = useStyles();
  const theme = useTheme() as Theme;
  const principal = useAccountPrincipalString();

  const copyRef = useRef<CopyRef>(null);

  const handleCopy = () => {
    if (copyRef) {
      copyRef?.current?.copy();
    }
  };

  const handleToExplorer = () => {
    if (!principal) return;
    mockALinkToOpen(getExplorerAccountLink(principalToAccount(principal)), "explorers_account");
  };

  return (
    <Box className={classes.wrapper}>
      <Box sx={{ marginBottom: "8px" }}>
        <Box className={classes.label} component="span">
          <Trans>Principal ID</Trans>
        </Box>
      </Box>
      <Typography
        component="span"
        sx={{
          whiteSpace: "break-spaces",
          cursor: "pointer",
          color: "#111936",
        }}
        onClick={handleCopy}
      >
        {principal}
      </Typography>
      <Copy content={principal ?? ""} hide ref={copyRef} />
      <Box component="span" ml="5px" sx={{ overflow: "hidden" }}>
        <LoadToExplorerIcon
          fontSize="24"
          sx={{
            position: "relative",
            top: "1px",
            cursor: "pointer",
            color: theme.colors.secondaryMain,
          }}
          onClick={handleToExplorer}
        />
      </Box>
    </Box>
  );
}
