import { Box } from "@mui/material";

import { routes, MAX_NUMBER } from "./config";
import { ExceedRoutes } from "./ExceedRoutes";
import { Routes } from "./Routes";

export default function NavBar() {
  return (
    <Box sx={{ display: "flex", gap: "0 12px" }}>
      <Routes routes={routes} />
      {routes.length > MAX_NUMBER ? <ExceedRoutes routes={routes} /> : null}
    </Box>
  );
}
