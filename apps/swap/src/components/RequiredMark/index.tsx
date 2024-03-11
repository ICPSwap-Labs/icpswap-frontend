import { Typography } from "@mui/material";

export default function RequiredMark() {
  return (
    <Typography
      sx={{
        color: "#D3625B",
      }}
      component="span"
    >
      *
    </Typography>
  );
}
