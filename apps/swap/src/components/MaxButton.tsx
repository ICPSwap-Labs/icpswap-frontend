import { Typography, TypographyProps } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { Trans } from "@lingui/macro";

export default function MaxButton(props: TypographyProps) {
  const theme = useTheme() as Theme;

  return (
    <Typography
      {...props}
      sx={{
        padding: "1px 3px",
        cursor: "pointer",
        borderRadius: "2px",
        backgroundColor: theme.colors.secondaryMain,
        color: "#ffffff",
        fontSize: "12px",
        lineHeight: "1.15rem",
        ...(props.sx ?? {}),
      }}
    >
      <Trans>Max</Trans>
    </Typography>
  );
}
