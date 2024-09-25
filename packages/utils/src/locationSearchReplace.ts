import { Null } from "@icpswap/types";
import qs from "qs";

export function locationSearchReplace(search: string, key: string, value: string | Null) {
  const __search = search.replace("?", "");
  const parsedSearch = qs.parse(__search);

  if (value) {
    parsedSearch[key] = value;
    return `?${qs.stringify(parsedSearch)}`;
  }

  Reflect.deleteProperty(parsedSearch, key);

  return `?${qs.stringify(parsedSearch)}`;
}
