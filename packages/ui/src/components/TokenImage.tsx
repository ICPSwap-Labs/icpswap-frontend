import { Avatar } from "@mui/material";

export interface TokenImageProps {
  logo: string | undefined | null;
  size?: string;
}

export function TokenImage({ logo, size }: TokenImageProps) {
  return (
    <Avatar
      src={logo}
      sx={{
        width: size ?? "24px",
        height: size ?? "24px",
        background: "transparent",
      }}
    >
      &nbsp;
    </Avatar>
  );
}
