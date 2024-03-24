import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../packages/candid/src/token-list/TokenList.did";
import fs from "fs";
import path from "path";

const tokenList = Actor.createActor(idlFactory, {
  agent: new HttpAgent({
    host: "https://icp0.io",
  }),
  canisterId: "k37c6-riaaa-aaaag-qcyza-cai",
});

interface Metadata {
  fee: bigint;
  decimals: bigint;
  name: string;
  rank: number;
  totalSupply: bigint;
  introduction: string;
  standard: string;
  symbol: string;
  canisterId: string;
}

async function fetch_and_write_file() {
  const result = (await tokenList.getList()) as { ok: Metadata[] };

  if (result.ok) {
    const allTokenMetadata = result.ok.map((e) => ({
      fee: Number(e.fee),
      decimals: Number(e.decimals),
      canisterId: e.canisterId,
      name: e.name,
      standard: e.standard,
      symbol: e.symbol,
    }));

    fs.writeFileSync(
      path.resolve(__dirname, "../apps/swap/src/.tokens.json"),
      JSON.stringify(allTokenMetadata, null, 2),
    );

    fs.writeFileSync(
      path.resolve(__dirname, "../apps/info/src/.tokens.json"),
      JSON.stringify(allTokenMetadata, null, 2),
    );
  } else {
    console.log("fetch tokens error");
  }
}

fetch_and_write_file();
