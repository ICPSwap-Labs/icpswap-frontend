import { actor, BeforeSubmitArgs, Connector } from "@icpswap/actor";
import { useEffect } from "react";
import store from "store/index";
import i18n from "i18n/index";

async function isCurrentAccount() {
  // const { principal } = store.getState().auth;

  // if (window.ic && window.ic.plug && !!principal) {
  //   const plugPrincipal = await window.ic.plug.getPrincipal();
  //   return plugPrincipal.toString() === principal;
  // }

  return true;
}

// Do something before the actor call submit
export function useBeforeActorSubmit() {
  useEffect(() => {
    // Check the principal local is equal to the principal in Plug wallet
    actor.onSubmit(async (args: BeforeSubmitArgs) => {
      if (!!args.identity && store.getState().auth.walletType === Connector.PLUG) {
        if (!(await isCurrentAccount())) {
          return {
            success: false,
            message: i18n.t`There was an error when tried to interact with Plug. Please reconnect the plug.`,
          };
        }
      }

      return { success: true, message: "" };
    });
  }, []);
}
