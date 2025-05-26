import { Switch } from "react-router-dom";

import AuthRoutes from "./Auth";

export default function Routes() {
  return (
    <Switch>
      <AuthRoutes />
    </Switch>
  );
}
