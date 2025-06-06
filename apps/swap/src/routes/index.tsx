import { Switch } from "react-router-dom";
import { memo } from "react";

import AuthRoutes from "./Auth";

export default memo(() => {
  return (
    <Switch>
      <AuthRoutes />
    </Switch>
  );
});
