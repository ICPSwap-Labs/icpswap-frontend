import { Box, Typography, useTheme, ButtonBase } from "components/Mui";
import WarningIcon from "assets/images/swap/warning";
import { Trans } from "@lingui/macro";
import { Flex } from "@icpswap/ui";

interface FullRangeWarningProps {
  onUnderstand: () => void;
}

export function FullRangeWarning({ onUnderstand }: FullRangeWarningProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        background: "rgba(255, 193, 7, 0.16)",
        border: `1px solid ${theme.colors.warningDark}`,
        borderRadius: "12px",
        padding: "24px",
      }}
    >
      <Flex gap="0 12px">
        <WarningIcon />
        <Typography
          sx={{
            color: theme.colors.warningDark,
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          <Trans>Efficiency Comparison</Trans>
        </Typography>
      </Flex>

      <Typography
        sx={{
          marginTop: "13px",
          color: theme.colors.warningDark,
          lineHeight: "18px",
        }}
      >
        <Trans>Full range positions may earn less fees than concentrated positions.</Trans>
      </Typography>
      <ButtonBase
        sx={{
          padding: "0 9px",
          backgroundColor: theme.colors.warningDark,
          color: theme.colors.darkLevel1,
          borderRadius: "8px",
          height: "32px",
          marginTop: "16px",
        }}
        onClick={onUnderstand}
      >
        <Trans>I Understand</Trans>
      </ButtonBase>
    </Box>
  );
}
