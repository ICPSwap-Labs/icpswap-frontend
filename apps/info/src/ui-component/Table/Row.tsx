import { Box, BoxProps } from "@mui/material";

export default function Row(props: BoxProps) {
  return (
    <Box
      {...props}
      sx={{
        padding: "20px 0",
        borderBottom: "1px solid rgba(189, 200, 240, 0.082)",
        ...props.sx,
      }}
    >
      {props.children}
    </Box>
  );
}
