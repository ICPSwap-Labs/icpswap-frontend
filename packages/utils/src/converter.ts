export const hexToBytes = (hex: string): number[] => {
  let new_hex = hex;

  if (new_hex.slice(0, 2) === "0x") {
    new_hex = hex.replace(/^0x/i, "");
  }

  const bytes: number[] = [];

  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }

  return bytes;
};

export const toHexString = (bytes: Uint8Array | number[]): string => {
  return [...bytes].reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
};

export const subaccountHexToBytes = (hex: string): number[] => {
  let new_hex = hex;

  if (new_hex.slice(0, 2) === "0x") {
    new_hex = hex.replace(/^0x/i, "");
  }

  const bytes: number[] = [];

  let __hex = hex;
  const hexLength = hex.length;

  for (let i = 0; i < 64 - hexLength; i++) {
    __hex = `.${hex}`;
  }

  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(__hex.slice(i, i + 2), 16));
  }

  return bytes;
};

export const subAccountToUint8Array = (hex: string): Uint8Array => {
  return Uint8Array.from(subaccountHexToBytes(hex));
};
