import { Box } from "components/Mui";

export interface CardContent1120Props {
  children: React.ReactNode;
}

export function CardContent1120({ children }: CardContent1120Props) {
  return (
    <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: "1120px" }}>{children}</Box>
    </Box>
  );
}
