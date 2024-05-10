import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  logo: {
    width: "64px",
    height: "64px",
  },
}));

function Arrow() {
  return (
    <svg width="55" height="11" viewBox="0 0 55 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="3" cy="5.24219" r="3" fill="#8492C4" />
      <rect x="5" y="4.24219" width="49" height="2" fill="#8492C4" />
      <path
        d="M49.2426 0.999547L53.4853 5.24219L49.2426 9.48483"
        stroke="#8492C4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface LogosProps {
  logo0: string | undefined;
  logo1: string | undefined;
}

export function Logos({ logo0, logo1 }: LogosProps) {
  const classes = useStyles();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0 37px", justifyContent: "center" }}>
      <Box className={classes.logo}>
        <img src={logo0} alt="" width="100%" height="100%" />
      </Box>

      <Arrow />

      <Box className={classes.logo}>
        <img src={logo1} alt="" width="100%" height="100%" />
      </Box>
    </Box>
  );
}
