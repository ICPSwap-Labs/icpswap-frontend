import { Route, Switch, useLocation } from "react-router-dom";
import MainLayout from "ui-component/MainLayout";
import { routesConfig } from "./config";
import Maintenance from "ui-component/Maintenance";
import PageNotFound from "ui-component/404";

const maintenancePages: string[] = [];

export default function MainRoutes() {
  const location = useLocation();

  const allPath = Object.keys(routesConfig);

  return (
    <Route path={allPath}>
      <MainLayout>
        <Switch location={location} key={location.pathname}>
          {allPath.map((pathName) => {
            const component = maintenancePages.includes(pathName) ? Maintenance : routesConfig[pathName];

            // @ts-ignore TODO:FIX
            return <Route key={pathName} exact path={pathName} component={component} />;
          })}
          {/* @ts-ignore */} TODO:FIX
          <Route path="*" component={PageNotFound} />
        </Switch>
      </MainLayout>
    </Route>
  );
}
