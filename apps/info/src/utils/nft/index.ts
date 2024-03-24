import { Principal } from "@dfinity/principal";

export function encodeTokenIdentifier(principal: string, index: number | bigint) {
  //@ts-ignore
  const padding = Buffer("\x0Atid");

  const array = new Uint8Array([
    ...padding,
    ...Principal.fromText(principal).toUint8Array(),
    ...to32bits(Number(index)),
  ]);
  return Principal.fromUint8Array(array).toText();
}

export function decodeTokenId(tid: string) {
  var p = [...Principal.fromText(tid).toUint8Array()];
  var padding = p.splice(0, 4);

  //@ts-ignore
  if (toHexString(padding) !== toHexString(Buffer("\x0Atid"))) {
    return {
      index: 0,
      canister: tid,
      token: encodeTokenIdentifier(tid, 0),
    };
  } else {
    return {
      index: from32bits(p.splice(-4)),
      // @ts-ignore
      canister: Principal.fromUint8Array(p).toText(),
      token: tid,
    };
  }
}

export function from32bits(data: number[]) {
  let value;

  for (var i = 0; i < 4; i++) {
    // @ts-ignore
    value = (value << 8) | data[i];
  }

  return value;
}

export function to32bits(num: number) {
  let arrayBuffer = new ArrayBuffer(4);
  new DataView(arrayBuffer).setUint32(0, num);
  return Array.from(new Uint8Array(arrayBuffer));
}

export function toHexString(byteArray: number[]) {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}
