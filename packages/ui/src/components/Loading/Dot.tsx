import { Box, makeStyles } from "../Mui";

interface StylesProps {
  color?: string;
  size?: string;
}

const useStyles = ({ color, size }: StylesProps) => {
  return makeStyles(() => {
    const translateLength = 5;

    return {
      dot: {
        display: "inline-block",
        width: size ?? "5px",
        height: size ?? "5px",
        backgroundColor: color ?? "rgba(255, 255, 255, 0.4)",
        borderRadius: "50%",
        animationDuration: "800ms",
        animationIterationCount: "infinite",
      },
      "@keyframes dot1Keyframes": {
        "0%": {
          transform: `translate(0, -${translateLength}px)`,
        },
        "33%": {
          transform: "translate(0, 0)",
        },
      },
      "@keyframes dot2Keyframes": {
        "0%": {
          transform: "translate(0, 0)",
        },
        "33%": {
          transform: `translate(0, -${translateLength}px)`,
        },
        "66%": {
          transform: "translate(0, 0)",
        },
      },
      "@keyframes dot3Keyframes": {
        "0%": {
          transform: "translate(0, 0)",
        },
        "66%": {
          transform: `translate(0, -${translateLength}px)`,
        },
      },
      dot1: {
        animationName: `$dot1Keyframes`,
        marginRight: "4px",
      },
      dot2: {
        animationName: `$dot2Keyframes`,
        marginRight: "4px",
      },
      dot3: {
        animationName: `$dot3Keyframes`,
      },
    };
  });
};

export interface DotLoadingProps {
  loading: boolean;
  size?: string;
  color?: string;
}

export function DotLoading({ loading, size, color }: DotLoadingProps) {
  const classes = useStyles({ color, size })();

  return loading ? (
    <Box
      sx={{
        display: "inline-block",
        height: "8px",
        lineHeight: "8px",
      }}
    >
      <span className={`${classes.dot} ${classes.dot1}`} />
      <span className={`${classes.dot} ${classes.dot2}`} />
      <span className={`${classes.dot} ${classes.dot3}`} />
    </Box>
  ) : null;
}
