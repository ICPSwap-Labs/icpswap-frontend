import { Box } from "@mui/material";

export interface TokenImageProps {
  src: string | undefined;
  width?: string;
  height?: string;
}

export function TokenImage({ src, width = "32px", height = "32px" }: TokenImageProps) {
  return (
    <Box sx={{ width, height, backgroundColor: src ? "transparent" : "#273155", borderRadius: "50%" }}>
      {src ? <img width="100%" height="100%" style={{ borderRadius: "50%" }} src={src} alt="" /> : null}
    </Box>
  );
}
