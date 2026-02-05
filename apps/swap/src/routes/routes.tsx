import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "components/Layout/index";
import PageNotFound from "components/404";
import { Maintenance } from "components/Maintenance";
import { useMemo } from "react";
import { useSettingMaintenance } from "@icpswap/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";

import { routeConfigs } from "./config";

export function routes() {
  const location = useLocation();

  const { result: __maintenancePages } = useSettingMaintenance();

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
