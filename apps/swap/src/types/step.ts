export type ExternalTipArgs = { message: string | undefined; tipKey?: string; poolId?: string; tokenId?: string };
export type OpenExternalTip = (args: ExternalTipArgs) => void;
