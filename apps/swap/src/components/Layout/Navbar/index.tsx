import { Box } from "components/Mui";

import { MAX_NUMBER, routes } from "./config";
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
