export const hexToBytes = (hex: string): number[] => {
  let new_hex = hex;

  if (new_hex.substr(0, 2) === "0x") {
    new_hex = hex.replace(/^0x/i, "");
  }

  const bytes = [];

  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }

  return bytes;
};

export const toHexString = (bytes: Uint8Array | number[]): string => {
  return [...bytes].reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
};

export const uint8ArrayToBigInt = (array: Uint8Array): bigint => {
  const view = new DataView(array.buffer, array.byteOffset, array.byteLength);

  if (typeof view.getBigUint64 === "function") return view.getBigUint64(0);

  const high = BigInt(view.getUint32(0));
  const low = BigInt(view.getUint32(4));
  return (high << BigInt(32)) + low;
};
