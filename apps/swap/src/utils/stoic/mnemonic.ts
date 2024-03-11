import { Ed25519KeyIdentity } from "@dfinity/identity";

const bip39 = require("bip39");

export function mnemonicToIdentity(mnemonic: string) {
  var seed = bip39.mnemonicToSeedSync(mnemonic);
  seed = Array.from(seed);
  seed = seed.splice(0, 32);
  seed = new Uint8Array(seed);
  return Ed25519KeyIdentity.generate(seed);
}

// TODO:FIX STOIC mnemonic validate
export function validateMnemonic(mnemonic: string): boolean {
  return true;
  // return bip39.validateMnemonic(mnemonic);
}
