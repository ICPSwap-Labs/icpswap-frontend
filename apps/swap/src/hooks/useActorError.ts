import { useErrorTip } from "hooks/useTips";
import { actor, ActorError } from "@icpswap/actor";
import { useEffect } from "react";
import { t } from "@lingui/macro";

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

export function useHandleActorError() {
  const [open] = useErrorTip();

  useEffect(() => {
    actor.onError((error: ActorError) => {
      if (isOutOfTimeRange(error.message)) {
        if (isNewMessage("Specified ingress_expiry not within expected range")) {
          open(t`Specified ingress_expiry not within expected range. Please reset your time on your device.`);
        }
      }
    });
  }, []);
}
