/** Parses a hex string (optional `0x` prefix) into an array of byte values. */
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

/** Encodes bytes as a contiguous lowercase hex string (two digits per byte). */
export const toHexString = (bytes: Uint8Array | number[]): string => {
  return [...bytes].reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
};

/**
 * Parses a subaccount hex string into 32 bytes, left-padding with `.` (0x2e) when shorter than 64 hex chars.
 * Strips an optional `0x` prefix from the input.
 */
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

/** Converts a subaccount hex string to a 32-byte `Uint8Array` via {@link subaccountHexToBytes}. */
export const subAccountToUint8Array = (hex: string): Uint8Array => {
  return Uint8Array.from(subaccountHexToBytes(hex));
};
