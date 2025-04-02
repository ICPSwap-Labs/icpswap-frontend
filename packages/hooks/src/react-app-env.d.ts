/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
  }
}

type DelegationMode = "global" | "domain";

interface WebViewConnectRequest {
  delegationTargets?: Array<string>;
  noUnify?: boolean;
  host: string;
  customDomain?: string;
  delegationModes?: Array<DelegationMode>;
}
