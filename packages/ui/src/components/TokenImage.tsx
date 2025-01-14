import { Avatar, Box, BoxProps } from "./Mui";
import { SnsIcon } from "../assets/icons/SNS";

export interface TokenImageProps {
  logo: string | undefined | null;
  size?: string;
  sns?: boolean;
  sx?: BoxProps["sx"];
}

export function TokenImage({ logo, size, sx, sns }: TokenImageProps) {
  return (
    <Box
      sx={{
        width: size ?? "24px",
        height: size ?? "24px",
        position: "relative",
        ...(sx ?? {}),
      }}
    >
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

      {sns ? (
        <SnsIcon
          sx={{
            width: size ?? "24px",
            height: size ?? "24px",
            background: "transparent",
            position: "absolute",
            top: "0",
            left: "0",
          }}
        />
      ) : null}
    </Box>
  );
}
