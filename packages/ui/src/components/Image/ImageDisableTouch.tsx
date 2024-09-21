import { Box, BoxProps } from "../Mui";

interface ImageDisableTouchProps {
  src: string;
  size?: string;
  sx?: BoxProps["sx"];
}

export function ImageDisableTouch({ src, size = "24px", sx }: ImageDisableTouchProps) {
  return (
    <Box sx={{ width: size, height: size, position: "relative", ...sx }}>
      <Box sx={{ width: size, height: size, position: "absolute", top: 0, left: 0 }} />
      <img src={src} width={size} height={size} alt="" style={{ borderRadius: "50%" }} />
    </Box>
  );
}
