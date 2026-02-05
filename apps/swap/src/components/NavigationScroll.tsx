import { useEffect, ReactNode, memo } from "react";
import { Helmet } from "react-helmet";
import { findRouteByPath } from "routes/RouteDefinition";
import { useLocation } from "react-router-dom";

export interface NavigationScrollProps {
  children: ReactNode;
}

export default memo(({ children }: NavigationScrollProps) => {
  const location = useLocation();
  const { pathname } = location;
  const route = findRouteByPath(pathname);
  const staticTitle = (route?.getTitle && route?.getTitle(pathname)) ?? "ICPSwap";

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
