import { Flex } from "../Grid";
import { Box, styled, type Theme } from "../Mui";

const LoadingContainer = styled(Flex)({
  position: "relative",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  minHeight: "300px",
  overflow: "hidden",
});

const Mask = styled(Box)(({ theme, mask }: { mask: boolean; theme: Theme }) =>
  mask
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: theme.palette.loading.background,
        opacity: 0.3,
      }
    : {},
);

export interface ImageLoadingProps {
  loading?: boolean;
  mask?: boolean;
}

export function ImageLoading({ loading = true, mask = false }: ImageLoadingProps) {
  return loading ? (
    <LoadingContainer fullWidth justify="center" align="center">
      <Mask mask={mask} />
      <img style={{ zIndex: 2 }} width="80px" height="80px" src="/images/loading.png" alt="" />
    </LoadingContainer>
  ) : null;
}
