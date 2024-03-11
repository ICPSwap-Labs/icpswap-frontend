import { Avatar, SxProps } from "@mui/material";

interface TokenImageProps {
  src: string | undefined;
  width?: string;
  height?: string;
  sx?: SxProps;
}

export function TokenImage({ src, width = "20px", height = "20px", sx }: TokenImageProps) {
  return (
    <Avatar sx={{ width, height, ...(sx ?? {}) }} src={src}>
      &nbsp;
    </Avatar>
  );
}
