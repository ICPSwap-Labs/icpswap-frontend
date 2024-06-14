import { Grid, Box, Typography } from "@mui/material";
import { TextButton } from "./TextButton";

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_30361_79133)">
        <path
          d="M15.8332 5.34102L14.6582 4.16602L9.99984 8.82435L5.3415 4.16602L4.1665 5.34102L8.82484 9.99935L4.1665 14.6577L5.3415 15.8327L9.99984 11.1743L14.6582 15.8327L15.8332 14.6577L11.1748 9.99935L15.8332 5.34102Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_30361_79133">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export interface GlobalTipsProps {
  onClose: () => void;
}

export function GlobalTips({ onClose }: GlobalTipsProps) {
  return (
    <Grid container alignItems="center" sx={{ height: "52px", background: "#B79C4A", padding: "0 20px" }}>
      <Grid item xs>
        <Typography
          sx={{
            color: "#ffffff",
            cursor: "pointer",
            "@media(max-width: 640px)": { fontSize: "12px" },
          }}
        >
          Join ICP's 3rd Anniversary on ICPSwap with liquidity mining and trading competition.{" "}
          <TextButton
            link="https://x.com/ICPSwap/status/1795078197165379886"
            color="white"
            textDecoration="underline"
            sx={{
              "@media(max-width: 640px)": { fontSize: "12px" },
            }}
          >
            Click here for details!
          </TextButton>
          <TextButton
            link="https://app.icpswap.com/farm"
            color="white"
            textDecoration="underline"
            sx={{
              "@media(max-width: 640px)": { fontSize: "12px" },
              margin: "0 0 0 5px!important",
            }}
          >
            Click here to earn juicy APR rewards!
          </TextButton>
        </Typography>
      </Grid>

      <Box sx={{ cursor: "pointer" }} onClick={onClose}>
        <CloseIcon />
      </Box>
    </Grid>
  );
}
