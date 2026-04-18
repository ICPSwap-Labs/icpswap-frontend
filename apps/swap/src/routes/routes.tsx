import { useSettingMaintenance } from "@icpswap/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";
import PageNotFound from "components/404";
import { Layout } from "components/Layout/index";
import { Maintenance } from "components/Maintenance";
import { useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { routeConfigs } from "./config";

export function LayoutWithRoutes() {
  const location = useLocation();

  const { data: __maintenancePages } = useSettingMaintenance();

  const maintenancePages = useMemo(() => {
    if (isUndefinedOrNull(__maintenancePages)) return [];

    return __maintenancePages.map(([, path]) => path);
  }, [__maintenancePages]);

  return (
    <Layout info={location.pathname.includes("info")}>
      <Routes>
        {routeConfigs.map(({ path, getElement }) => {
          const __component = maintenancePages.includes(path) ? <Maintenance /> : getElement();
          return <Route key={path} path={path} element={__component} />;
        })}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Layout>
  );
}
