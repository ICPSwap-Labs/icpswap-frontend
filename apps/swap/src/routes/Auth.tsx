import { Route, Switch, useLocation } from "react-router-dom";
import { Layout } from "components/Layout/index";
import PageNotFound from "components/404";
import { Maintenance } from "components/Maintenance";
import React, { useMemo } from "react";
import { useSettingMaintenance } from "@icpswap/hooks";
import { isUndefinedOrNull } from "@icpswap/utils";

import { routeConfigs } from "./config";

export default function MainRoutes() {
  const location = useLocation();

  const allPaths = routeConfigs.map((element) => element.path);

  const { result: __maintenancePages } = useSettingMaintenance();

  const maintenancePages = useMemo(() => {
    if (isUndefinedOrNull(__maintenancePages)) return [];

    return __maintenancePages.map(([, path]) => path);
  }, [__maintenancePages]);

  return (
    <Route path={allPaths}>
      <Layout info={location.pathname.includes("info")}>
        <Switch location={location} key={location.pathname}>
          {routeConfigs.map(({ path, getElement }) => {
            const GetComponent = (props: React.PropsWithChildren) => {
              const __component = maintenancePages.includes(path)
                ? Maintenance
                : () => {
                    return <>{getElement()}</>;
                  };
              return React.createElement(__component, null, props.children);
            };

            return <Route key={path} exact path={path} component={GetComponent} />;
          })}

          <Route path="*" component={PageNotFound} />
        </Switch>
      </Layout>
    </Route>
  );
}
