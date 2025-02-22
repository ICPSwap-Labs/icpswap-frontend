import { Typography } from "components/Mui";

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
