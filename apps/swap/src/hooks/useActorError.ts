import { useErrorTip } from "hooks/useTips";
import { actor, ActorError } from "@icpswap/actor";
import { useEffect } from "react";
import { useLogout, useConnectManager } from "store/auth/hooks";

const INTERVAL = 30; // 30 seconds

const timeOfMessages: { [message: string]: number } = {};

function isNewMessage(message: string) {
  const last_time = timeOfMessages[message];

  const now = new Date().getTime();

  if (!last_time) {
    timeOfMessages[message] = now;
    return true;
  }

  if (now - last_time > INTERVAL * 1000) {
    timeOfMessages[message] = now;
    return true;
  }

  return false;
}

export function isWithoutCyclesError(message: string) {
  return (
    message.includes("Please top up the canister with cycles and try again") ||
    message.includes("is out of cycles") ||
    message.includes("could not perform remote call")
  );
}

export function isOutOfTimeRange(message: string) {
  return message.includes("Specified ingress_expiry not within expected range: Minimum allowed expiry");
}

export function isIISignatureVerificationError(message: string) {
  return message.includes("Code: 400 () Body: Invalid signature");
}

export function useHandleActorError() {
  const [open] = useErrorTip();
  const logout = useLogout();
  const { showConnector } = useConnectManager();

  useEffect(() => {
    actor.onError(async (error: ActorError) => {
      if (isOutOfTimeRange(error.message)) {
        if (isNewMessage("Specified ingress_expiry not within expected range")) {
          open(`Specified ingress_expiry not within expected range. Please reset your time on your device.`);
        }
      }

      if (isIISignatureVerificationError(error.message)) {
        open(
          `Code 400 – Signature Verification Failed. Your Internet Identity session has expired. Please reconnect your II and try again — it should work smoothly.`,
        );
        await logout();
        showConnector(true);
      }
    });
  }, []);
}
