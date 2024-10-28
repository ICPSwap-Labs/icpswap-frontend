import { IdentityKitProvider } from "@nfid/identitykit/react";
import { NFIDW, Plug, InternetIdentity } from "@nfid/identitykit";
// import { useEffect, useState } from "react";
import "@nfid/identitykit/react/styles.css";

import App from "./App";
import { LanguageProvider } from "./i18n";
import { MAX_IDENTITY_KIT_TIME_LIVE } from "./constants";
// import { getDelegationIds } from "./constants/connector";

export function AppWithProvider() {
  // const [delegationIds, setDelegationIds] = useState<null | string[]>(null);

  // useEffect(() => {
  //   async function call() {
  //     const ids = await getDelegationIds();
  //     setDelegationIds(ids);
  //   }

  //   call();
  // }, []);

  return (
    <LanguageProvider>
      <IdentityKitProvider
        signers={[NFIDW, Plug, InternetIdentity]}
        signerClientOptions={{
          maxTimeToLive: MAX_IDENTITY_KIT_TIME_LIVE,
          // targets: ["ojlo4-eqaaa-aaaag-ak5wq-cai"],
        }}
      >
        <App />
      </IdentityKitProvider>
    </LanguageProvider>
  );
}
