import { Switch, Route, Redirect } from "react-router-dom";
import AuthRoutes from "./Auth";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/swap" />
      </Route>
      <AuthRoutes />
    </Switch>
  );
}
