import { arrayOfNumberToUint8Array, asciiStringToByteArray, bigIntToUint8Array } from "@dfinity/utils";
import { SubAccount } from "@dfinity/ledger-icp";
import { sha256 } from "@noble/hashes/sha2";
import { Principal } from "@dfinity/principal";

export { Actor, ActorSubclass, HttpAgent, type ActorMethod, Agent, Identity } from "@dfinity/agent";
export { Principal } from "@dfinity/principal";
export { IDL } from "@dfinity/candid";
export { SubAccount, AccountIdentifier } from "@dfinity/ledger-icp";
export { AuthClient } from "@dfinity/auth-client";
export { decodeIcrcAccount, encodeIcrcAccount } from "@dfinity/ledger-icrc";

export const memoToNeuronSubaccount = ({ controller, memo }: { controller: Principal; memo: bigint }): SubAccount => {
  const padding = asciiStringToByteArray("neuron-stake");
  const shaObj = sha256.create();
  shaObj.update(
    arrayOfNumberToUint8Array([padding.length, ...padding, ...controller.toUint8Array(), ...bigIntToUint8Array(memo)]),
  );

  return SubAccount.fromBytes(shaObj.digest()) as SubAccount;
};

export * from "./ckETH";
