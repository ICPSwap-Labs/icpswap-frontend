import { Grid, Box, Typography } from "@mui/material";
// import { TextButton } from "./TextButton";

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
          The SNS function is deployed based on the NNS frontend and is currently in public testing.
          {/* <TextButton
            link="https://nns.ic0.app/project/?project=csyra-haaaa-aaaaq-aacva-cai"
            color="write"
            textDecoration="underline"
            sx={{
              "@media(max-width: 640px)": { fontSize: "12px" },
            }}
          >
            Click here to join the excitement!
          </TextButton> */}
        </Typography>
      </Grid>

      <Box sx={{ cursor: "pointer" }} onClick={onClose}>
        <CloseIcon />
      </Box>
    </Grid>
  );
}
