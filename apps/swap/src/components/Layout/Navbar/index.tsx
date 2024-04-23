import { Box } from "@mui/material";
import { useHistory } from "react-router-dom";
import { mockALinkAndOpen } from "utils/index";

import { routes, Route, MAX_NUMBER } from "./config";
import { ExceedRoutes } from "./ExceedRoutes";
import { Routes } from "./Routes";

export default function NavBar() {
  const history = useHistory();

  const handleMenuClick = (route: Route) => {
    if (!route.path && !route.link) return;

    if (route.link) {
      mockALinkAndOpen(route.link ?? "", "nav-bar-menu");
    } else {
      history.push(route.path ?? "");
    }
  };

  return (
    <Box sx={{ display: "flex", gap: "0 12px" }}>
      <Routes routes={routes} onMenuClick={handleMenuClick} />
      {routes.length > MAX_NUMBER ? <ExceedRoutes routes={routes} onMenuClick={handleMenuClick} /> : null}
    </Box>
  );
}
