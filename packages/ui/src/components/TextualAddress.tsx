import { isValidAccount, nonUndefinedOrNull, shorten, subaccountHexToBytes, toHexString } from "@icpswap/utils";
import { decodeIcrcAccount, encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { useMemo } from "react";
import { Principal } from "@dfinity/principal";
import { NONE_SUB_HEX } from "@icpswap/constants";

import { Tooltip } from "./Tooltip";
import { Typography, TypographyProps } from "./Mui";
import { Flex } from "./Grid/index";
import { Copy } from "./Copy";

interface GetTextualAddressProps {
  shorten?: boolean;
  shortenLength?: number;
  textualAddress?: string | undefined | null;
  owner?: string | null;
  account?: string | null;
  subaccount?: string | null;
  alias?: string;
}

export function getTextualAddress({
  shorten: isShorten = true,
  shortenLength = 8,
  textualAddress,
  owner: __owner,
  account: __account,
  subaccount: __subaccount,
  alias,
}: GetTextualAddressProps) {
  const __textualAddress = nonUndefinedOrNull(textualAddress)
    ? textualAddress
    : nonUndefinedOrNull(__owner)
    ? encodeIcrcAccount({
        owner: Principal.fromText(__owner),
        subaccount: __subaccount && __subaccount !== NONE_SUB_HEX ? subaccountHexToBytes(__subaccount) : undefined,
      })
    : nonUndefinedOrNull(__account)
    ? __account
    : undefined;

  return nonUndefinedOrNull(alias)
    ? alias
    : isShorten
    ? `${shorten(__textualAddress, shortenLength)}`
    : __textualAddress;
}

export interface TextualAddressProps {
  copyable?: boolean;
  shorten?: boolean;
  length?: number;
  textualAddress?: string | undefined | null;
  owner?: string | null;
  account?: string | null;
  subaccount?: string | null;
  maxWidth?: string;
  alias?: string;
  sx?: TypographyProps["sx"];
  onCopy?: () => void;
}

export function TextualAddress({
  shorten: isShorten = true,
  length = 8,
  textualAddress,
  owner: __owner,
  account: __account,
  subaccount: __subaccount,
  alias,
  sx,
  onCopy,
}: TextualAddressProps) {
  const __textualAddress = useMemo(() => {
    if (textualAddress) return textualAddress;

    if (__owner) {
      return encodeIcrcAccount({
        owner: Principal.fromText(__owner),
        subaccount: __subaccount && __subaccount !== NONE_SUB_HEX ? subaccountHexToBytes(__subaccount) : undefined,
      });
    }

    if (!__owner && __account) {
      return __account;
    }

    return undefined;
  }, [textualAddress, __owner, __subaccount, __account]);

  const { owner, sub } = useMemo(() => {
    if (!__textualAddress) return {};

    if (isValidAccount(__textualAddress)) {
      return { owner: __textualAddress, sub: undefined };
    }

    try {
      const { owner, subaccount } = decodeIcrcAccount(__textualAddress);
      return { owner: owner.toString(), sub: subaccount ? toHexString(subaccount) : undefined };
    } catch (error) {
      console.error(error);
      console.warn("Invalid textualAddress: ", __textualAddress);
    }

    return {};
  }, [__textualAddress]);

  const address = useMemo(() => {
    if (!owner) return undefined;
    if (sub && sub !== NONE_SUB_HEX) {
      return encodeIcrcAccount({ owner: Principal.fromText(owner), subaccount: subaccountHexToBytes(sub) });
    }

    return owner;
  }, [owner, sub, NONE_SUB_HEX]);

  return __textualAddress ? (
    <Tooltip
      tips={
        <Flex vertical gap="8px 0" align="flex-start">
          <Flex vertical gap="2px 0" align="flex-start">
            <Typography color="text.tooltip" style={{ fontSize: "12px" }}>
              ID:
            </Typography>
            <Copy content={address} onCopy={onCopy}>
              <Typography color="text.tooltip" style={{ lineHeight: "14px", fontSize: "12px", wordBreak: "break-all" }}>
                {address}
              </Typography>
            </Copy>
          </Flex>

          <Flex vertical gap="2px 0" align="flex-start">
            <Typography color="text.tooltip" style={{ fontSize: "12px" }}>
              Owner:
            </Typography>
            <Copy content={owner} onCopy={onCopy}>
              <Typography
                color="text.tooltip"
                style={{ lineHeight: "14px", fontSize: "12px", wordBreak: "break-all", cursor: "pointer" }}
              >
                {owner}
              </Typography>
            </Copy>
          </Flex>

          {sub && sub !== NONE_SUB_HEX ? (
            <Flex vertical gap="2px 0" align="flex-start">
              <Typography color="text.tooltip" style={{ fontSize: "12px" }}>
                Subaccount:
              </Typography>
              <Copy content={sub} onCopy={onCopy}>
                <Typography
                  color="text.tooltip"
                  style={{ lineHeight: "14px", fontSize: "12px", wordBreak: "break-all" }}
                >
                  {sub}
                </Typography>
              </Copy>
            </Flex>
          ) : null}
        </Flex>
      }
    >
      <Typography sx={{ ...sx }}>
        {alias ?? (isShorten ? `${shorten(__textualAddress, length)}` : `${__textualAddress}`)}
      </Typography>
    </Tooltip>
  ) : (
    <Typography sx={{ ...sx }}>--</Typography>
  );
}
