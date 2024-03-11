import { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import ReactGA from "react-ga";
import { REACT_GA_TRACKING_ID } from "constants/index";
import { isMobile } from "react-device-detect";

export default function GoogleAnalytics({ location: { pathname, search } }: RouteComponentProps): null {
  useEffect(() => {
    ReactGA.pageview(`${pathname}${search}`);
  }, [pathname, search]);
  return null;
}

export function initGoogleAnalytics() {
  if (typeof REACT_GA_TRACKING_ID === "string") {
    ReactGA.initialize(REACT_GA_TRACKING_ID);

    ReactGA.set({
      anonymizeIp: true,
      customBrowserType: !isMobile ? "desktop" : "web3" in window ? "mobileWeb3" : "mobileRegular",
    });
  } else {
    ReactGA.initialize("test", { testMode: true, debug: true });
  }
}
