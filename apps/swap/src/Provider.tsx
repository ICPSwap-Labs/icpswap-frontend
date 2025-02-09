import { IdentityKitProvider } from "@nfid/identitykit/react";
import { NFIDW, IdentityKitAuthType } from "@nfid/identitykit";
import "@nfid/identitykit/react/styles.css";

import { I18nextProvider } from "react-i18next";
import i18n from "i18n/index";

import App from "./App";
import { MAX_IDENTITY_KIT_TIME_LIVE } from "./constants";

export function AppWithProvider() {
  return (
    <I18nextProvider i18n={i18n}>
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
    </I18nextProvider>
  );
}
