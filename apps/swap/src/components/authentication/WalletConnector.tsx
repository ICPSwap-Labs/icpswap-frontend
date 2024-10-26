import { ReactNode } from "react";
import { Flex } from "@icpswap/ui";
import { useConnectManager } from "store/auth/hooks";

export default function WalletConnector({ children }: { children: ReactNode }) {
  const { showConnector } = useConnectManager();

  return (
    <Flex fullWidth justify="center" onClick={() => showConnector(true)}>
      {children}
    </Flex>
  );
}
