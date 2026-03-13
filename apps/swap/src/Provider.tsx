import { useAppSelector } from "store/hooks";
import { StyledEngineProvider, ThemeProvider } from "components/Mui";
import { SnackbarProvider } from "components/notistack";
import TransactionsUpdater from "store/transactions/updater";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "constants/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DisableIframe } from "components/DisableIframe";
import { WalletContextProvider } from "components/Wallet/WalletContextProvider";
import { GlobalContextProvider } from "components/Global";
import { I18nextProvider } from "react-i18next";
import i18n from "i18n/index";
import { IdentityKitProvider } from "@nfid/identitykit/react";
import { NFIDW, IdentityKitAuthType } from "@nfid/identitykit";
import { useState } from "react";

import { theme } from "./theme";
import { App } from "./App";
import { MAX_IDENTITY_KIT_TIME_LIVE } from "./constants";

import "@nfid/identitykit/react/styles.css";

export function AppWithProvider() {
  const customization = useAppSelector((state) => state.customization);
  const [queryClient] = useState(() => new QueryClient());

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
        <DisableIframe>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <StyledEngineProvider injectFirst>
                <WalletContextProvider>
                  <TransactionsUpdater />
                  <ThemeProvider theme={theme(customization)}>
                    <SnackbarProvider maxSnack={100}>
                      <GlobalContextProvider>
                        <App />
                      </GlobalContextProvider>
                    </SnackbarProvider>
                  </ThemeProvider>
                </WalletContextProvider>
              </StyledEngineProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </DisableIframe>
      </IdentityKitProvider>
    </I18nextProvider>
  );
}
