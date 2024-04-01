import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as icrc_idlFactory } from "../packages/candid/src/icrc/icrc1.did";
import tokens from "../apps/swap/src/.tokens.json";

const icrc = (canisterId: string) =>
  Actor.createActor(icrc_idlFactory, {
    agent: new HttpAgent({
      host: "https://icp0.io",
    }),
    canisterId,
  });

type Value = { Int: bigint } | { Nat: bigint } | { Blob: Array<number> } | { Text: string };

type Token = {
  fee: number;
  decimals: number;
  canisterId: string;
  name: string;
  standard: string;
  symbol: string;
};

function success_log(log: string) {
  console.log("\x1b[34m", log);
}

function error_log(log: string) {
  console.log("\x1b[31m", log);
}

async function fetch_and_check(token: Token) {
  if (token.standard === "ICRC1" || token.standard === "ICRC2") {
    let metadata: Array<[string, Value]> | undefined;

    try {
      metadata = (await icrc(token.canisterId).icrc1_metadata()) as Array<[string, Value]>;
    } catch (error) {
      console.log(error);
      error_log(`retry ${token.canisterId} ${token.symbol}`);
    }

    if (metadata === undefined) {
      error_log(`${token.symbol} get metadata failed`);
      return;
    }

    let name: string = "";
    let symbol: string = "";
    let decimals: bigint = BigInt(0);
    let fee: bigint = BigInt(0);
    let logo: string = "";

    for (let i = 0; i < metadata.length; i++) {
      const ele = metadata[i];
      if (ele[0] === "icrc1:name") {
        const val = ele[1] as { Text: string };
        name = val.Text;
      } else if (ele[0] === "icrc1:symbol") {
        const val = ele[1] as { Text: string };
        symbol = val.Text;
      } else if (ele[0] === "icrc1:decimals") {
        const val = ele[1] as { Nat: bigint };
        decimals = val.Nat;
      } else if (ele[0] === "icrc1:fee") {
        const val = ele[1] as { Nat: bigint };
        fee = val.Nat;
      } else if (ele[0] === "icrc1:logo") {
        const val = ele[1] as { Text: string };
        logo = val.Text;
      }
    }

    if (name !== token.name) {
      error_log(`ERROR: ${token.canisterId} ${token.symbol}: name wrong: ${token.name}, value from metadata: ${name}`);
      return;
    } else if (symbol !== token.symbol) {
      error_log(
        `ERROR: ${token.canisterId} ${token.symbol}: symbol wrong: ${token.symbol}, value from metadata: ${symbol}`,
      );
      return;
    } else if (Number(decimals) !== token.decimals) {
      error_log(
        `ERROR: ${token.canisterId} ${token.symbol}: decimals wrong: ${token.decimals}, value from metadata: ${decimals}`,
      );
      return;
    } else if (Number(fee) !== token.fee) {
      error_log(`ERROR: ${token.canisterId} ${token.symbol}: fee wrong: ${token.fee}, value from metadata: ${fee}`);
      return;
    }

    success_log(`SUCCESS: ${token.canisterId} ${token.symbol}`);
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function go() {
  const allLocalTokens = [...tokens];

  for (let i = 0; i < allLocalTokens.length; i++) {
    const token = allLocalTokens[i];
    if (i !== 0 && i % 40 === 0) {
      await sleep(5000);
    }

    fetch_and_check(token);
  }
}

go();
