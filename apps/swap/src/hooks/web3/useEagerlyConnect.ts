import { metamask } from "utils/web3/connection";
import { useEffect } from "react";
import { isMobile } from "react-device-detect";

export default function useEagerlyConnect() {
  useEffect(() => {
    metamask.connectEagerly()?.catch(() => {
      console.error("Failed to connect eagerly to metamask");
    });

    if (isMobile) {
      metamask.activate()?.catch(() => {
        console.error("Failed to connect eagerly to metamask");
      });
    }
  }, []);
}
