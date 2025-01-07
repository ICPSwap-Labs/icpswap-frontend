import { CircularProgress, Box, makeStyles, Theme } from "../Mui";
import { Flex } from "../Grid";

const useStyles = makeStyles((theme: Theme) => {
  return {
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
    },
    mask: {
      position: "absolute",
      left: 0,
      width: "100%",
      height: "100%",
      background: theme.palette.loading.background,
      opacity: 0.7,
    },
  };
});

interface LoadingProps {
  loading: boolean;
  circularSize?: number;
  maskBorderRadius?: string;
}

export function Loading({ loading, circularSize = 40, maskBorderRadius }: LoadingProps) {
  const classes = useStyles();

  return loading ? (
    <Flex className={classes.loadingContainer} fullWidth justify="center" align="center">
      <Box
        className={classes.mask}
        sx={{
          ...(maskBorderRadius ? { borderRadius: maskBorderRadius } : {}),
        }}
      />
      <CircularProgress color="inherit" size={circularSize} />
    </Flex>
  ) : null;
}
