import { Box } from "components/Mui";

import { routes, MAX_NUMBER } from "./config";
import { ExceedRoutes } from "./ExceedRoutes";
import { Routes } from "./Routes";

export default function NavBar() {
  return (
    <Box sx={{ display: "flex", gap: "0 8px" }}>
      <Routes routes={routes} />
      {routes.length > MAX_NUMBER ? <ExceedRoutes routes={routes} /> : null}
    </Box>
  );
}
