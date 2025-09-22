import { Box } from "components/Mui";
import { useSyncYourTokensHandler } from "hooks/wallet/useSyncYourTokens";
import { useRotateAnimationLoading, ROTATE_ANIMATION_LOADING_CLASS } from "components/theme";

export function SyncYourTokens() {
  const classes = useRotateAnimationLoading();
  const { loading, syncYourTokensHandler } = useSyncYourTokensHandler();

  return (
    <Box
      sx={{
        width: "24px",
        height: "24px",
        cursor: "pointer",
      }}
      onClick={syncYourTokensHandler}
      className={`${classes.rotateAnimationLoading}${loading ? ` ${ROTATE_ANIMATION_LOADING_CLASS}` : ""}`}
    >
      <img src="/images/wallet/refresh.svg" alt="" />
    </Box>
  );
}
