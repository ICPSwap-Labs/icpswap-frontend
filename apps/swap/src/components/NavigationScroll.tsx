import { memo, type ReactNode, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { findRouteByPath } from "routes/RouteDefinition";

export interface NavigationScrollProps {
  children: ReactNode;
}

export default memo(({ children }: NavigationScrollProps) => {
  const location = useLocation();
  const { pathname } = location;
  const route = findRouteByPath(pathname);
  const staticTitle = route?.getTitle?.(pathname) ?? "ICPSwap";

  // Every time pathname change should scrollTo top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{staticTitle}</title>
      </Helmet>
      {children}
    </>
  );
});
