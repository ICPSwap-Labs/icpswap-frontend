import { Route, Switch, useLocation } from "react-router-dom";
import MainLayout from "components/MainLayout";
import PageNotFound from "components/404";
import { Maintenance } from "components/Maintenance";
import { routeConfigs } from "./config";

const maintenancePages: string[] = [
  // "/swap",
  // "/swap/liquidity",
  // "/swap/liquidity/add/:currencyIdA?/:currencyIdB?/:feeAmount?",
  // "/swap/liquidity/decrease/:positionId/:pool",
  // "/swap/liquidity/increase/:positionId/:pool",
  // "/swap/reclaim",
  // "/swap/v2/liquidity",
  // "/swap/v2/liquidity/add/:currencyIdA?/:currencyIdB?/:feeAmount?",
  // "/swap/v2/liquidity/decrease/:positionId?",
  // "/swap/v2/liquidity/increase/:positionId?",
  // "/swap/v2/wrap",
  // "/staking-farm",
  // "/staking-farm/create",
];

export default function MainRoutes() {
  const location = useLocation();

  const allPath = Object.keys(routeConfigs);

  return (
    <Route path={allPath}>
      <MainLayout>
        <Switch location={location} key={location.pathname}>
          {allPath.map((pathName) => {
            const component = maintenancePages.includes(pathName) ? Maintenance : routeConfigs[pathName];

            // @ts-ignore TODO:FIX
            return <Route key={pathName} exact path={pathName} component={component} />;
          })}
          {/* @ts-ignore TODO:FIX */}
          <Route path="*" component={PageNotFound} />
        </Switch>
      </MainLayout>
    </Route>
  );
}
