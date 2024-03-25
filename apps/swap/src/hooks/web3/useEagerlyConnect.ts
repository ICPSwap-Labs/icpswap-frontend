import { metamask } from "utils/web3/connection";
import { useEffect } from "react";

export default function useEagerlyConnect() {
  useEffect(() => {
    metamask.connectEagerly()?.catch(() => {
      console.error("Failed to connect eagerly to metamask");
    });
    // The dependency list is empty so this is only run once on mount
  }, []);
}
