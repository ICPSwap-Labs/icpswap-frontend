import { IdentityKitProvider } from "@nfid/identitykit/react";
import { NFIDW, IdentityKitAuthType } from "@nfid/identitykit";
import "@nfid/identitykit/react/styles.css";

import App from "./App";
import { LanguageProvider } from "./i18n";
import { MAX_IDENTITY_KIT_TIME_LIVE } from "./constants";

export function AppWithProvider() {
  return (
    <LanguageProvider>
      <IdentityKitProvider
        authType={IdentityKitAuthType.DELEGATION}
        signers={[NFIDW]}
        signerClientOptions={{
          maxTimeToLive: MAX_IDENTITY_KIT_TIME_LIVE,
          // SwapFactory
          targets: ["4mmnk-kiaaa-aaaag-qbllq-cai"],
        }}
      >
        <App />
      </IdentityKitProvider>
    </LanguageProvider>
  );
}
