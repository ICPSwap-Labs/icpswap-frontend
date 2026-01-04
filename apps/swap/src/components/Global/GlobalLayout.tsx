import { useConnectManager } from "store/auth/hooks";
import RiskStatement from "components/RiskStatement";
import WalletConnector from "components/authentication/ConnectorModal";
import GlobalSteps from "components/Steps/index";
import { FullscreenLoading } from "components/index";
import { GlobalActorError } from "components/Global/GlobalActorError";

export function GlobalLayout() {
  const { open: connectorModalOpen, isConnected } = useConnectManager();

  return (
    <>
      <FullscreenLoading />
      <GlobalSteps />
      {isConnected ? <RiskStatement /> : null}
      {connectorModalOpen ? <WalletConnector /> : null}
      <GlobalActorError />
    </>
  );
}
