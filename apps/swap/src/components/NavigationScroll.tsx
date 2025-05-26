import { useEffect, ReactNode, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import { findRouteByPath } from "routes/RouteDefinition";

export interface NavigationScrollProps extends RouteComponentProps {
  children: ReactNode;
}

export default withRouter(({ children, location: { pathname } }: NavigationScrollProps) => {
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    const route = findRouteByPath(pathname);
    const staticTitle = (route?.getTitle && route?.getTitle(pathname)) ?? "ICPSwap";
    setTitle(staticTitle);
  }, [pathname]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
      </Helmet>
      {children}
    </>
  );
});
