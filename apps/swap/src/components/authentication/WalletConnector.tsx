import { Flex } from "@icpswap/ui";
import type { ReactNode } from "react";
import { useConnectManager } from "store/auth/hooks";

export default function WalletConnector({ children }: { children: ReactNode }) {
  const { showConnector } = useConnectManager();

  return (
    <Flex fullWidth justify="center" onClick={() => showConnector(true)}>
      {children}
    </Flex>
  );
}
