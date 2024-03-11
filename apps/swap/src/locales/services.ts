import { t } from "@lingui/macro";

export type Locals = {
  [key: string]: string;
};

export const TokenLocales: Locals = {
  insufficient_cycles_balance: t`Insufficient cycles balance`,
  invalid_value: t`Invalid value`,
  has_been_initialized: t`Has been initialized`,
  no_sufficient_balance: t`Insufficient balance`,
  unsupported_operator: t`Unsupported operator`,
  no_balance: t`Insufficient balance`,
  no_enough_balance: t`Insufficient balance`,
  permission_deined: t`Permission denied`,
  not_mint_token_list: t`You are not in the whitelist`,
  max_tokens_limit: t`No seat for the Mint Token authority.`,
  token_exists: t`Token exists`,
  invaild_token_symbol: t`Invalid token symbol`,
  insufficient_ics_balance: t`Insufficient token balance`,
  mint_token_error: t`Mint token error`,
  InsufficientBalance: t`Insufficient Balance`,
  handling_fee_error: t`Insufficient Balance`,
};

export const SwapLocales: Locals = {
  "mint liquidity failed": t`Failed to mint liquidity`,
  "collect failed": t`Failed to Collect`,
  "burn failed": t`Failed to burn`,
  "create pool task is busy, please try again later": t`Create pool task is busy, please try again later`,
  "token amount should be more than triple the transfer fee": t`Token amount should be more than triple the transfer fee`,
  "position can not be burned if not cleared": t`Position can not be burned if not cleared`,
  "high price impact": t`High price impact`,
};

export const NFTLocals: Locals = {
  NFT_claim_paused: t`The claim function is not open now. Stay tuned`,
  NFT_claim_email_code_error: t`Failed to claim. Please check your email or airdrop redemption code`,
  NFT_was_claimed: t`Failed to claim. This airdrop redemption code has been claimed`,
  NFT_claim_exceeded: t`You have reached a limit for claiming NFT`,
  NFT_token_not_exist: t`The claiming NFT tokenId does not exist`,
  "Insufficient ICP balance": t`Insufficient WICP balance`,
  "exceeded max supply": t`Exceed the limit of supply`,
  permission_denied: t`Permission denied`,
  "Canister not found": t`Can't not find this canister`,
  "Check collection name or creator": t`Invalid collection name or creator`,
  "NFTCanisterController insufficient cycles balance": t`Insufficient cycles balance`,
  "Exceeded max supply": t`Exceeded max supply`,
  "Must use amount of 1": t`Must use amount of 1`,
  "Without authorization": t`Without authorization`,
  "Invalid owner": t`Invalid owner`,
  "Invalid token": t`Invalid token`,
  can_not_find_token: t`Can't not find this token`,
  "Order not found": t`Order not found`,
  "Trading stoped": t`Trading was stopped`,
  "Request error": t`Request error`,
  "NFT royalties are too high": t`NFT royalties are too high`,
  "Please complete the authorization operation": t`Please complete the authorization operation`,
  "Order is locked": t`Order is locked`,
  "Trade faild": t`Failed to Trade`,
  "Operation failed": t`Operation failed`,
  "Tx hash is not exist": t`Tx hash is not exist`,
  "Tx fee settle error": t`Tx fee settle error`,
  "Royalties fee settle error": t`Royalties fee settle error`,
  "Transfer wicp to seller error": t`An error occurred while transferring token to the seller`,
  "FullMath illegal result": t`FullMath illegal result`,
  "Buyer and seller are the same": t`Buyer and seller are the same`,
  "Operation failed e2": t`Operation failed e2`,
  "Operation failed e1": t`Operation failed e1`,
  "NFT transfer for the market failed": t`Failed to transfer NFT for the market`,
  "Order does not exist": t`Order does not exist`,
};

export const StakingLocals: Locals = {
  "ward amount must be positive": t`Reward amount must be positive`,
  "The start time must be now or in the future": t`The start time must be now or in the future`,
  "The start time must be recent": t`The start time must be recent`,
  "The start time must be earlier than the end time": t`The start time must be earlier than the end time`,
  "The incentive duration is too long": t`The incentive duration is too long`,
  "An error occurred during the reward token transfer": t`An error occurred during the reward token transfer`,
  "The creator does not have permission to use this feature": t`The creator does not have permission to use this feature`,
  "You can't end the incentive pool because there are still staking users": t`You can't end the incentive pool because there are still staking users`,
  "The incentive pool cannot be terminated before the end time": t`The incentive pool cannot be terminated before the end time`,
  "You have not available refund": t`You have not available refund`,
  "The incentive pool cannot be terminated because there are staked NFTs in the incentive pool": t`The incentive pool cannot be terminated because there are staked NFTs in the incentive pool`,
  "The position(LP) NFT canister has not been found": t`The position(LP) NFT canister has not been found`,
  "The position(LP)  NFT you staked is incorrect and does not match the current incentive pool": t`The position(LP)  NFT you staked is incorrect and does not match the current incentive pool`,
  "The position(LP) NFT has already staked": t`The position(LP) NFT has already staked`,
  "Incentive is closure": t`Incentive pool is closure`,
  "The incentive pool has not started": t`The incentive pool has not started`,
  "The incentive pool has ended": t`The incentive pool has ended`,
  "Cannot endincentive while depositsMap are staked": t`Cannot endincentive while epositsMap are staked`,
  "The incentive pool doesn't exist": t`The incentive pool doesn't exist`,
  "The position(LP) NFT has not incentive pool": t`The position(LP) NFT has not incentive pool`,
  "You can not stake position(LP) NFT of no liquidity": t`You can not stake position(LP) NFT of no liquidity`,
  "You may not stake the same NFT more than once": t`You may not stake the same NFT more than once`,
  "NFT you staked is not you": t`NFT you staked is not you`,
  "You cannot withdraw to staker the Position(LP) NFT": t`You cannot withdraw to staker the Position(LP) NFT`,
  "Only position(LP) nft owners can withdraw them before the end of the incentive pool": t`Only position(LP) nft owners can withdraw them before the end of the incentive pool`,
  "You withdrawed a position(LP) NFT of no liquidity": t`You withdrew a position(LP) NFT of no liquidity`,
  "Error in transferring NFT, please change your account and try again": t`Error in transferring NFT, please change your account and try again`,
  "Error in withdrawing, please change your account and try again": t`Error in withdrawing, please change your account and try again`,
  "The position(LP) NFT has not staked": t`The position(LP) NFT has not staked`,
  "Created successfully": t`Created successfully`,
  "End the incentive pool successfully": t`Ended the incentive pool successfully`,
  "Staked successfully": t`Staked successfully`,
  "Deposited Successfully": t`Deposited Successfully`,
  "Withdrew Successfully": t`Withdrew Successfully`,
  "Harvest successfully": t`Harvested successfully`,
  "Harvest Failurefully": t`Failed to harvest`,
  "StartTime must be now or in the future": t`StartTime must be now or in the future`,
  "StartTime too far intoFuture": t`StartTime too far intoFuture`,
  "StartTime must be before end time": t`StartTime must be before end time`,
  "Incentive duration is too long": t`Incentive duration is too long`,
  "A minimum of 1000 Tokens are required to create a pool": t`A minimum of 1000 Tokens are required to create a pool`,
  "Create Storage canister Failurefully": t`Failed to created storage canister`,
  "Create SwapStaker Canister Failurefully": t`Failed to create SwapStaker canister`,
  "Adapter metadata query error": t`Adapter metadata query error`,
  "Approved successfully": t`Approved successfully`,
  "Create SingleSmartChefStaker Successfully": t`Created SingleSmartChefStaker successfully`,
  "The amount of withdrawal is less than the staking token transfer fee": t`The amount of withdrawal is less than the staking token transfer fee`,
  "The amount of deposit is less than the staking token transfer fee": t`The amount of deposit is less than the staking token transfer fee`,
  "The withdrawal task is busy, and please try again later": t`The withdrawal task is busy, and please try again later`,
  "The amount of withdrawal can’t be 0": t`The amount of withdrawal can’t be 0`,
  "The amount of deposit can’t be 0": t`The amount of deposit can’t be 0`,
  "The deposit task is busy, and please try again later": t`The deposit task is busy, and please try again later`,
  "The harvest task is busy, and please try again later": t`The harvest task is busy, and please try again later`,
};

export const WICPLocales: Locals = {
  Unauthorized: t`Unauthorized`,
  error_to_address: t`Invalid To Address`,
  amount_too_small: t`Requested amount is too small`,
  used_block_height: t`The block height has been used`,
  block_error: t`Invalid block height`,
  insufficient_funds: t`Insufficient funds`,
  InsufficientBalance: "Insufficient balance",
  unexpected_error: "Unexpected error",
};

export const VoteMessages: Locals = {
  "Proposal has no voting rights allocated": t`Proposal has no voting rights allocated`,
};

export const XTCMessages: Locals = {
  InsufficientBalance: t`Insufficient Balance`,
  InvalidTokenContract: t`Invalid token contract`,
  NotSufficientLiquidity: t`Insufficient liquidity`,
};

export const ClaimMessages: Locals = {
  "Your claim quota wasn't found": t`Sorry, this address is not eligible to claim`,
};

// This is a map of message and it's locale id
export const MessageMaps: Locals = {
  ...NFTLocals,
  ...TokenLocales,
  ...WICPLocales,
  ...StakingLocals,
  ...SwapLocales,
  ...ClaimMessages,
  ...XTCMessages,
  ...VoteMessages,
};

export const getLocaleMessage = (message: string): string => {
  const id = MessageMaps[message];
  const msg = t({ id });

  return !!msg ? msg : message;
};
