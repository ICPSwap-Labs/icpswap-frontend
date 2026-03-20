import WalletConnector from "components/authentication/ConnectorModal";
import { BeginnerGuide } from "components/BeginnerGuide";
import { GlobalActorError } from "components/Global/GlobalActorError";
import { FullscreenLoading } from "components/index";
import RiskStatement from "components/RiskStatement";
import GlobalSteps from "components/Steps/index";
import { useConnectManager } from "store/auth/hooks";

export function GlobalLayout() {
  const { open: connectorModalOpen, isConnected } = useConnectManager();

  return (
    <>
      <FullscreenLoading />
      <GlobalSteps />
      {isConnected ? <RiskStatement /> : null}
      {connectorModalOpen ? <WalletConnector /> : null}
      <BeginnerGuide />
      <GlobalActorError />
    </>
  );
}
