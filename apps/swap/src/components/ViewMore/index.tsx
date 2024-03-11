import { Button, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { Trans } from "@lingui/macro";

export default function ViewMore({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  const theme = useTheme() as Theme;

  return (
    <Button
      variant="outlined"
      size="large"
      sx={{
        "&.MuiButton-outlined.MuiButton-outlinedPrimary": {
          color: theme.palette.text.secondary,
          borderColor: theme.palette.text.secondary,
          height: "42px",
          minWidth: "132px",
        },
      }}
      onClick={onClick}
    >
      {loading ? <CircularProgress size={18} color="inherit" sx={{ margin: "0 4px 0 0" }} /> : null}
      <Typography fontWeight={600}>
        <Trans>View More</Trans>
      </Typography>
    </Button>
  );
}
