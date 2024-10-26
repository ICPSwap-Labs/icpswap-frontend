import { useCallback } from "react";

import { useCallsData } from "./useCallData";

export type ipLocationResult = {
  ip: string;
  ip_version: number;
  response_code: number;
  response_message: string;
};

export function useIpLocation() {
  return useCallsData(
    useCallback(async () => {
      const fetch_result = await fetch("https://api.iplocation.net/?cmd=get-ip").catch(() => undefined);
      if (!fetch_result) return undefined;
      return (await fetch_result.json()) as ipLocationResult;
    }, []),
  );
}

export type ipLocationCodeResult = {
  ip: string;
  ip_number: string;
  ip_version: number;
  country_name: string;
  country_code2: string;
  isp: string;
  response_code: string;
  response_message: string;
};

export function useIpLocationCode() {
  const { result: ipLocation } = useIpLocation();

  return useCallsData(
    useCallback(async () => {
      if (!ipLocation || !ipLocation.ip) return undefined;

      const fetch_result = await fetch(`https://api.iplocation.net/?cmd=ip-country&ip=${ipLocation.ip}`).catch(
        () => undefined,
      );

      if (!fetch_result) return undefined;

      const result = (await fetch_result.json()) as ipLocationCodeResult;

      if (result) {
        return result.country_code2;
      }

      return undefined;
    }, [ipLocation]),
  );
}
