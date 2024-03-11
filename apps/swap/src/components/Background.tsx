import { Box } from "@mui/material";

export default function Background() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        pointerEvents: "none",
        transform: "unset",
        background: "radial-gradient(65% 100% at 48% 0%,rgba(255, 143, 224, 0.1) 0, rgba(33, 41, 70, .1) 100%)",
        width: "100vw",
        height: "100vh",
        zIndex: "-1",
      }}
    />
  );
}
