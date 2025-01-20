import { Box } from "@mui/material";

export function dexToolsUrl(id: string) {
  return `https://www.dextools.io/widget-chart/en/icp/pe-light/${id}?theme=dark&chartType=1&chartResolution=30&drawingToolbars=false`;
}

export interface DexToolsProps {
  id: string | undefined;
  height?: string;
}

export function DexTools({ id, height }: DexToolsProps) {
  return (
    <Box sx={{ width: "100%", height: height ?? "100%" }}>
      {id ? (
        <iframe
          id="dextools-widget"
          title="DEXTools Trading Chart"
          style={{ width: "100%", height: "100%" }}
          src={dexToolsUrl(id)}
        />
      ) : null}
    </Box>
  );
}
