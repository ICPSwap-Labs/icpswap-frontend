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
      return (await (
        await fetch("https://api.iplocation.net/?cmd=get-ip")
      ).json()) as ipLocationResult;
    }, [])
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

      const result = (await (
        await fetch(
          `https://api.iplocation.net/?cmd=ip-country&ip=${ipLocation.ip}`
        )
      ).json()) as ipLocationCodeResult;

      if (result) {
        return result.country_code2;
      }

      return undefined;
    }, [ipLocation])
  );
}
