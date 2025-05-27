import { useEffect, ReactNode } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import { findRouteByPath } from "routes/RouteDefinition";

export interface NavigationScrollProps extends RouteComponentProps {
  children: ReactNode;
}

export default withRouter(({ children, location: { pathname } }: NavigationScrollProps) => {
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
