import { Null, AlertInfo, AddAlertArgs } from "@icpswap/types";
import { icpswap_fetch_post, nonUndefinedOrNull, resultFormat } from "@icpswap/utils";
import { useQuery } from "@tanstack/react-query";
import { priceAlerts } from "@icpswap/actor";

export async function getPriceAlertEmail(principal: string) {
  const result = await icpswap_fetch_post<string>("/info/account/get/email", { principal });
  return result?.data;
}

export async function sendPriceAlertEmail({ email, principal }: { email: string; principal: string }) {
  const result = await icpswap_fetch_post("/info/verify/email/send", { principal, email });
  return result;
}

interface VerifyPriceAlertEmailArgs {
  email: string;
  principal: string;
  code: string;
}

export async function verifyPriceAlertEmail({ email, principal, code }: VerifyPriceAlertEmailArgs) {
  const result = await icpswap_fetch_post("/info/verify/submit", { principal, email, code });
  return result;
}

export function usePriceAlertEmail(principal: string | Null) {
  return useQuery({
    queryKey: ["priceAlertEmail"],
    queryFn: async () => {
      return await getPriceAlertEmail(principal);
    },
    enabled: nonUndefinedOrNull(principal),
  });
}

export async function getPriceAlerts() {
  return resultFormat<Array<AlertInfo>>(await (await priceAlerts(true)).get_user_alerts()).data;
}

export function usePriceAlerts(principal: string | Null) {
  return useQuery({
    queryKey: ["priceAlerts", principal],
    queryFn: async () => {
      return await getPriceAlerts();
    },
    enabled: nonUndefinedOrNull(principal),
  });
}

export async function addPriceAlert(args: AddAlertArgs) {
  return resultFormat<null>(await (await priceAlerts(true)).add_alert(args));
}

export async function deletePriceAlert(id: bigint) {
  return resultFormat<null>(await (await priceAlerts(true)).delete_alert(id));
}
