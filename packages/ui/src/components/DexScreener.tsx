import { Box } from "@mui/material";

export interface DexScreenerProps {
  id: string | undefined;
  height?: string;
}

export function DexScreener({ id, height }: DexScreenerProps) {
  return (
    <Box sx={{ width: "100%", height: height ?? "100%" }}>
      {id ? (
        <iframe
          title="DexScreener"
          style={{ width: "100%", height: "100%" }}
          src={`https://dexscreener.com/icp/${id}?embed=1&theme=dark&trades=0&info=0`}
        />
      ) : null}
    </Box>
  );
}
