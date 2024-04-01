import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "../packages/candid/src/token-list/AllTokenOfSwap.did";
import fs from "fs";
import path from "path";

const tokenList = Actor.createActor(idlFactory, {
  agent: new HttpAgent({
    host: "https://icp0.io",
  }),
  canisterId: "aofop-yyaaa-aaaag-qdiqa-cai",
});

interface Metadata {
  fee: bigint;
  decimals: bigint;
  logo: [] | [string];
  name: string;
  ledger_id: Principal;
  min_burn_amount: bigint;
  max_supply: [] | [bigint];
  index: bigint;
  standard: string;
  total_supply: bigint;
  symbol: string;
}

async function fetch_and_write_file() {
  const result = (await tokenList.get_token_list(0, 10000, [])) as { ok: { content: Metadata[] } };

  if (result.ok) {
    const content = result.ok.content;

    const allTokenMetadata = content.map((e) => ({
      fee: Number(e.fee),
      decimals: Number(e.decimals),
      canisterId: e.ledger_id.toString(),
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
