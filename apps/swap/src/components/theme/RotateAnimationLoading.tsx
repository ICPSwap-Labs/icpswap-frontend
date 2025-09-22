import { makeStyles } from "components/Mui";

export const ROTATE_ANIMATION_TIME = 1000;

export const ROTATE_ANIMATION_LOADING_CLASS = "rotate-animation-loading";

export const useRotateAnimationLoading = makeStyles(() => {
  return {
    rotateAnimationLoading: {
      [`&.${ROTATE_ANIMATION_LOADING_CLASS}`]: {
        animation: `$${ROTATE_ANIMATION_LOADING_CLASS} ${ROTATE_ANIMATION_TIME}ms`,
        animationIterationCount: "infinite",
      },
    },
    [`@keyframes ${ROTATE_ANIMATION_LOADING_CLASS}`]: {
      "0%": {
        transform: "rotate(0deg)",
      },
      "100%": {
        transform: "rotate(360deg)",
      },
    },
  };
});
