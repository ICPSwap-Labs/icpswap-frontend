import { ReactNode } from "react";
import { Typography, Box, Grid } from "@mui/material";
import { useTheme } from "@mui/styles";
import Modal from "components/modal/index";
import { Trans } from "@lingui/macro";
import { Theme } from "@mui/material/styles";

export default function VoteConfirm({
  open,
  onClose,
  onConfirm,
  optionLabel,
  powers,
  noPower,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  optionLabel: ReactNode | undefined | null;
  powers: bigint | undefined | null;
  noPower: boolean;
}) {
  const theme = useTheme() as Theme;

  return (
    <Modal
      open={open}
      onClose={onClose}
      showConfirm
      showCancel
      confirmDisabled={noPower}
      onConfirm={onConfirm}
      onCancel={onClose}
      confirmText={noPower ? <Trans>No powers</Trans> : <Trans>Vote</Trans>}
    >
      <Grid container alignItems="center" justifyContent="center">
        <Typography
          fontSize="20px"
          fontWeight={700}
          sx={{ maxWidth: "420px", lineHeight: "28px", padding: "20px 0 0 0" }}
          color="text.primary"
          align="center"
        >
          <Trans>Are you sure want to cast this vote? This action cannot be undone</Trans>
        </Typography>
      </Grid>

      <Box
        sx={{
          border: `1px solid ${theme.palette.background.level3}`,
          borderRadius: "12px",
          marginTop: "40px",
          padding: "32px 16px",
        }}
      >
        <Grid container>
          <Grid item xs>
            <Typography fontWeight={600}>
              <Trans>Options</Trans>
            </Typography>
          </Grid>
          <Typography color="text.primary">{optionLabel}</Typography>
        </Grid>

        <Grid container sx={{ marginTop: "24px" }}>
          <Grid item xs>
            <Typography fontWeight={600}>
              <Trans>Your voting power</Trans>
            </Typography>
          </Grid>
          <Typography color="text.primary">{String(powers ?? BigInt(0))} Votes</Typography>
        </Grid>
      </Box>
    </Modal>
  );
}
