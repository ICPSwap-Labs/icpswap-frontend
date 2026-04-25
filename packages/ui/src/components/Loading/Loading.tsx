import { Flex } from "../Grid";
import { Box, CircularProgress, useTheme } from "../Mui";

interface LoadingProps {
  loading: boolean;
  circularSize?: number;
  maskBorderRadius?: string;
}

export function Loading({ loading, circularSize = 40, maskBorderRadius }: LoadingProps) {
  const theme = useTheme();

  return loading ? (
    <Flex
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      fullWidth
      justify="center"
      align="center"
    >
      <Box
        sx={{
          position: "absolute",
          left: 0,
          width: "100%",
          height: "100%",
          background: theme.palette.loading.background,
          opacity: 0.7,
          ...(maskBorderRadius ? { borderRadius: maskBorderRadius } : {}),
        }}
      />
      <CircularProgress color="inherit" size={circularSize} />
    </Flex>
  ) : null;
}
