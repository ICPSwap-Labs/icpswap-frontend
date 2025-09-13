import { Box, makeStyles } from "components/Mui";
import { useSyncYourTokensHandler } from "hooks/wallet/useSyncYourTokens";

const ANIMATION_TIME = 1000;

const useStyles = makeStyles(() => {
  return {
    rotate: {
      "&.loading": {
        animation: `$loading ${ANIMATION_TIME}ms`,
        animationIterationCount: "infinite",
      },
    },
    "@keyframes loading": {
      "0%": {
        transform: "rotate(0deg)",
      },
      "100%": {
        transform: "rotate(360deg)",
      },
    },
  };
});

export function SyncYourTokens() {
  const classes = useStyles();
  const { loading, syncYourTokensHandler } = useSyncYourTokensHandler();

  return (
    <Box
      sx={{
        width: "24px",
        height: "24px",
        cursor: "pointer",
      }}
      onClick={syncYourTokensHandler}
      className={`${classes.rotate}${loading ? " loading" : ""}`}
    >
      <img src="/images/wallet/refresh.svg" alt="" />
    </Box>
  );
}
