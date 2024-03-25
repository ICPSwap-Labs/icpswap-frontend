import { parse, ParsedQs } from "qs";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function parsedQueryString(search?: string): ParsedQs {
  let string: string = search ?? "";

  if (!search) {
    // react-router-dom places search string in the hash
    const { hash } = window.location;
    string = hash.substr(hash.indexOf("?"));
  }

  return string && string.length > 1 ? parse(string, { parseArrays: false, ignoreQueryPrefix: true }) : {};
}

export function useParsedQueryString(): ParsedQs {
  const { search } = useLocation();
  return useMemo(() => parsedQueryString(search), [search]);
}
