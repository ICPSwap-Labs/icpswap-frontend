import { useEffect, ReactNode } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

export interface NavigationScrollProps extends RouteComponentProps {
  children: ReactNode;
}

export default withRouter(({ children, location: { pathname } }: NavigationScrollProps) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return children || (null as any);
});
