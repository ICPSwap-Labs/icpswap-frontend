import { actor, BeforeSubmitArgs, Connector } from "@icpswap/actor";
import { useEffect } from "react";
import store from "store/index";
import { t } from "@lingui/macro";

async function isCurrentAccount() {
  // const { principal } = store.getState().auth;

  // TODO
  // if (window.ic && window.ic.plug && !!principal) {
  //   const plugPrincipal = await window.ic.plug.getPrincipal();
  //   return plugPrincipal.toString() === principal;
  // }

  return true;
}

export function useActorSubmit() {
  useEffect(() => {
    actor.onSubmit(async (args: BeforeSubmitArgs) => {
      if (!!args.identity && store.getState().auth.walletType === Connector.PLUG) {
        if (!(await isCurrentAccount())) {
          return {
            success: false,
            message: t`There was an error when tried to interact with Plug. Please reconnect the plug.`,
          };
        }
      }

      return { success: true, message: "" };
    });
  }, []);
}
