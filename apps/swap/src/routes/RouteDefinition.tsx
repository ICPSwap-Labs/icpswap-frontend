import { matchPath } from "react-router-dom";
import { routeConfigs } from "./config";

export const findRouteByPath = (pathname: string) => {
  for (const route of routeConfigs) {
    const match = matchPath(route.path, pathname);

    if (match) return route;

    const subPaths = route.nestedPaths?.map((nestedPath) => `${route.path}/${nestedPath}`) ?? [];
    for (const subPath of subPaths) {
      const match = matchPath(subPath, pathname);
      if (match) {
        return route;
      }
    }
  }

  return undefined;
};
