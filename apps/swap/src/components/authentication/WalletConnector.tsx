import { Flex } from "@icpswap/ui";
import type { ReactNode } from "react";
import { useShowConnector } from "store/auth/hooks";

export default function WalletConnector({ children }: { children: ReactNode }) {
  const { showConnector } = useShowConnector();

  return (
    <Flex fullWidth justify="center" onClick={() => showConnector(true)}>
      {children}
    </Flex>
  );
}
