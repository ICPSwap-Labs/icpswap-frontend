import { useTheme, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles((theme: Theme) => {
  return {
    button: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "140px",
      height: "40px",
      borderRadius: "8px",
      background: theme.palette.background.level1,
      cursor: "pointer",
    },
  };
});

export interface ImportTokenTipProps {
  onOk: () => void;
  onNo: () => void;
}

export function ImportTokenTip({ onOk, onNo }: ImportTokenTipProps) {
  const theme = useTheme() as Theme;
  const classes = useStyles();

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "12px",
        background: theme.palette.background.level4,
        padding: "24px 0",
      }}
    >
      <Typography align="center">
        <Trans>The token is not found in the list, do you want to import it?</Trans>
      </Typography>
      <Box mt="16px" sx={{ display: "flex", justifyContent: "center", gap: "0 20px" }}>
        <Box className={classes.button} onClick={onNo}>
          <Typography color="text.primary" fontWeight={500}>
            <Trans>No</Trans>
          </Typography>
        </Box>
        <Box className={classes.button} onClick={onOk}>
          <Typography color="text.primary" fontWeight={500}>
            <Trans>Yes</Trans>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
