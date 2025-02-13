import i18n from "./index";

export type Locals = {
  [key: string]: string;
};

export const TokenLocales: Locals = {
  insufficient_cycles_balance: i18n.t`Insufficient cycles balance`,
  invalid_value: i18n.t`Invalid value`,
  has_been_initialized: i18n.t`Has been initialized`,
  no_sufficient_balance: i18n.t`Insufficient balance`,
  unsupported_operator: i18n.t`Unsupported operator`,
  no_balance: i18n.t`Insufficient balance`,
  no_enough_balance: i18n.t`Insufficient balance`,
  permission_deined: i18n.t`Permission denied`,
  not_mint_token_list: i18n.t`You are not in the whitelist`,
  max_tokens_limit: i18n.t`No seat for the Mint Token authority.`,
  token_exists: i18n.t`Token exists`,
  invaild_token_symbol: i18n.t`Invalid token symbol`,
  insufficient_ics_balance: i18n.t`Insufficient token balance`,
  mint_token_error: i18n.t`Mint token error`,
  InsufficientBalance: i18n.t`Insufficient balance`,
  handling_fee_error: i18n.t`Insufficient balance`,
};

export const SwapLocales: Locals = {
  "mint liquidity failed": i18n.t`Failed to mint liquidity`,
  "collect failed": i18n.t`Failed to Collect`,
  "burn failed": i18n.t`Failed to burn`,
  "create pool task is busy, please try again later": i18n.t`Create pool task is busy, please try again later`,
  "token amount should be more than triple the transfer fee": i18n.t`Token amount should be more than triple the transfer fee`,
  "position can not be burned if not cleared": i18n.t`Position can not be burned if not cleared`,
  "high price impact": i18n.t`High price impact`,
};

export const NFTLocals: Locals = {
  NFT_claim_paused: i18n.t`The claim function is not open now. Stay tuned`,
  NFT_claim_email_code_error: i18n.t`Failed to claim. Please check your email or airdrop redemption code`,
  NFT_was_claimed: i18n.t`Failed to claim. This airdrop redemption code has been claimed`,
  NFT_claim_exceeded: i18n.t`You have reached a limit for claiming NFT`,
  NFT_token_not_exist: i18n.t`The claiming NFT tokenId does not exist`,
  "Insufficient ICP balance": i18n.t`Insufficient WICP balance`,
  "exceeded max supply": i18n.t`Exceed the limit of supply`,
  permission_denied: i18n.t`Permission denied`,
  "Canister not found": i18n.t`Can'i18n.t not find this canister`,
  "Check collection name or creator": i18n.t`Invalid collection name or creator`,
  "NFTCanisterController insufficient cycles balance": i18n.t`Insufficient cycles balance`,
  "Exceeded max supply": i18n.t`Exceeded max supply`,
  "Must use amount of 1": i18n.t`Must use amount of 1`,
  "Without authorization": i18n.t`Without authorization`,
  "Invalid owner": i18n.t`Invalid owner`,
  "Invalid token": i18n.t`Invalid token`,
  can_not_find_token: i18n.t`Can'i18n.t not find this token`,
  "Order not found": i18n.t`Order not found`,
  "Trading stoped": i18n.t`Trading was stopped`,
  "Request error": i18n.t`Request error`,
  "NFT royalties are too high": i18n.t`NFT royalties are too high`,
  "Please complete the authorization operation": i18n.t`Please complete the authorization operation`,
  "Order is locked": i18n.t`Order is locked`,
  "Trade faild": i18n.t`Failed to Trade`,
  "Operation failed": i18n.t`Operation failed`,
  "Tx hash is not exist": i18n.t`Tx hash is not exist`,
  "Tx fee settle error": i18n.t`Tx fee settle error`,
  "Royalties fee settle error": i18n.t`Royalties fee settle error`,
  "Transfer wicp to seller error": i18n.t`An error occurred while transferring token to the seller`,
  "FullMath illegal result": i18n.t`FullMath illegal result`,
  "Buyer and seller are the same": i18n.t`Buyer and seller are the same`,
  "Operation failed e2": i18n.t`Operation failed e2`,
  "Operation failed e1": i18n.t`Operation failed e1`,
  "NFT transfer for the market failed": i18n.t`Failed to transfer NFT for the market`,
  "Order does not exist": i18n.t`Order does not exist`,
};

export const StakingLocals: Locals = {
  "ward amount must be positive": i18n.t`Reward amount must be positive`,
  "The start time must be now or in the future": i18n.t`The start time must be now or in the future`,
  "The start time must be recent": i18n.t`The start time must be recent`,
  "The start time must be earlier than the end time": i18n.t`The start time must be earlier than the end time`,
  "The incentive duration is too long": i18n.t`The incentive duration is too long`,
  "An error occurred during the reward token transfer": i18n.t`An error occurred during the reward token transfer`,
  "The creator does not have permission to use this feature": i18n.t`The creator does not have permission to use this feature`,
  "You can'i18n.t end the incentive pool because there are still staking users": i18n.t`You can'i18n.t end the incentive pool because there are still staking users`,
  "The incentive pool cannot be terminated before the end time": i18n.t`The incentive pool cannot be terminated before the end time`,
  "You have not available refund": i18n.t`You have not available refund`,
  "The incentive pool cannot be terminated because there are staked NFTs in the incentive pool": i18n.t`The incentive pool cannot be terminated because there are staked NFTs in the incentive pool`,
  "The position(LP) NFT canister has not been found": i18n.t`The position(LP) NFT canister has not been found`,
  "The position(LP)  NFT you staked is incorrect and does not match the current incentive pool": i18n.t`The position(LP)  NFT you staked is incorrect and does not match the current incentive pool`,
  "The position(LP) NFT has already staked": i18n.t`The position(LP) NFT has already staked`,
  "Incentive is closure": i18n.t`Incentive pool is closure`,
  "The incentive pool has not started": i18n.t`The incentive pool has not started`,
  "The incentive pool has ended": i18n.t`The incentive pool has ended`,
  "Cannot endincentive while depositsMap are staked": i18n.t`Cannot endincentive while epositsMap are staked`,
  "The incentive pool doesn'i18n.t exist": i18n.t`The incentive pool doesn'i18n.t exist`,
  "The position(LP) NFT has not incentive pool": i18n.t`The position(LP) NFT has not incentive pool`,
  "You can not stake position(LP) NFT of no liquidity": i18n.t`You can not stake position(LP) NFT of no liquidity`,
  "You may not stake the same NFT more than once": i18n.t`You may not stake the same NFT more than once`,
  "NFT you staked is not you": i18n.t`NFT you staked is not you`,
  "You cannot withdraw to staker the Position(LP) NFT": i18n.t`You cannot withdraw to staker the Position(LP) NFT`,
  "Only position(LP) nft owners can withdraw them before the end of the incentive pool": i18n.t`Only position(LP) nft owners can withdraw them before the end of the incentive pool`,
  "You withdrawed a position(LP) NFT of no liquidity": i18n.t`You withdrew a position(LP) NFT of no liquidity`,
  "Error in transferring NFT, please change your account and try again": i18n.t`Error in transferring NFT, please change your account and try again`,
  "Error in withdrawing, please change your account and try again": i18n.t`Error in withdrawing, please change your account and try again`,
  "The position(LP) NFT has not staked": i18n.t`The position(LP) NFT has not staked`,
  "Created successfully": i18n.t`Created successfully`,
  "End the incentive pool successfully": i18n.t`Ended the incentive pool successfully`,
  "Staked successfully": i18n.t`Staked successfully`,
  "Deposited Successfully": i18n.t`Deposited Successfully`,
  "Withdrew Successfully": i18n.t`Withdrew Successfully`,
  "Harvest successfully": i18n.t`Harvested successfully`,
  "Harvest Failurefully": i18n.t`Failed to harvest`,
  "StartTime must be now or in the future": i18n.t`StartTime must be now or in the future`,
  "StartTime too far intoFuture": i18n.t`StartTime too far intoFuture`,
  "StartTime must be before end time": i18n.t`StartTime must be before end time`,
  "Incentive duration is too long": i18n.t`Incentive duration is too long`,
  "A minimum of 1000 Tokens are required to create a pool": i18n.t`A minimum of 1000 Tokens are required to create a pool`,
  "Create Storage canister Failurefully": i18n.t`Failed to created storage canister`,
  "Create SwapStaker Canister Failurefully": i18n.t`Failed to create SwapStaker canister`,
  "Adapter metadata query error": i18n.t`Adapter metadata query error`,
  "Approved successfully": i18n.t`Approved successfully`,
  "Create SingleSmartChefStaker Successfully": i18n.t`Created SingleSmartChefStaker successfully`,
  "The amount of withdrawal is less than the staking token transfer fee": i18n.t`The amount of withdrawal is less than the staking token transfer fee`,
  "The amount of deposit is less than the staking token transfer fee": i18n.t`The amount of deposit is less than the staking token transfer fee`,
  "The withdrawal task is busy, and please try again later": i18n.t`The withdrawal task is busy, and please try again later`,
  "The amount of withdrawal can’t be 0": i18n.t`The amount of withdrawal can’t be 0`,
  "The amount of deposit can’t be 0": i18n.t`The amount of deposit can’t be 0`,
  "The deposit task is busy, and please try again later": i18n.t`The deposit task is busy, and please try again later`,
  "The harvest task is busy, and please try again later": i18n.t`The harvest task is busy, and please try again later`,
};

export const WICPLocales: Locals = {
  Unauthorized: i18n.t`Unauthorized`,
  error_to_address: i18n.t`Invalid To Address`,
  amount_too_small: i18n.t`Requested amount is too small`,
  used_block_height: i18n.t`The block height has been used`,
  block_error: i18n.t("wrap.error.invalid.block"),
  insufficient_funds: i18n.t`Insufficient funds`,
  InsufficientBalance: i18n.t`Insufficient balance`,
  unexpected_error: "Unexpected error",
};

export const VoteMessages: Locals = {
  "Proposal has no voting rights allocated": i18n.t`Proposal has no voting rights allocated`,
};

export const XTCMessages: Locals = {
  InsufficientBalance: i18n.t`Insufficient balance`,
  InvalidTokenContract: i18n.t`Invalid token contract`,
  NotSufficientLiquidity: i18n.t`Insufficient liquidity`,
};

export const ClaimMessages: Locals = {
  "Your claim quota wasn't found": i18n.t`Sorry, this address is not eligible to claim`,
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
  return MessageMaps[message];
};
