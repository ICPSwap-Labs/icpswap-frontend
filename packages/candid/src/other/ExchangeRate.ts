import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Asset { 'class' : AssetClass, 'symbol' : string }
export type AssetClass = { 'Cryptocurrency' : null } |
  { 'FiatCurrency' : null };
export interface Error { 'message' : ExchangeRateError, 'timestamp' : bigint }
export type ExchangeRateError = { 'AnonymousPrincipalNotAllowed' : null } |
  { 'CryptoQuoteAssetNotFound' : null } |
  { 'FailedToAcceptCycles' : null } |
  { 'ForexBaseAssetNotFound' : null } |
  { 'CryptoBaseAssetNotFound' : null } |
  { 'StablecoinRateTooFewRates' : null } |
  { 'ForexAssetsNotFound' : null } |
  { 'InconsistentRatesReceived' : null } |
  { 'RateLimited' : null } |
  { 'StablecoinRateZeroRate' : null } |
  { 'Other' : { 'code' : number, 'description' : string } } |
  { 'ForexInvalidTimestamp' : null } |
  { 'NotEnoughCycles' : null } |
  { 'ForexQuoteAssetNotFound' : null } |
  { 'StablecoinRateNotFound' : null } |
  { 'Pending' : null };
export interface ExchangeRate__1 {
  'decimals' : number,
  'rate' : bigint,
  'error' : [] | [Error],
  'timestamp' : bigint,
  'quote_symbol' : string,
  'quote_class' : string,
  'base_symbol' : string,
  'base_class' : string,
}
export interface _SERVICE {
  'add_asset' : ActorMethod<[Asset, Asset], undefined>,
  'force_update_rate' : ActorMethod<[], undefined>,
  'get_assets' : ActorMethod<[], Array<[Asset, Asset]>>,
  'get_exchange_rate' : ActorMethod<[string], ExchangeRate__1>,
  'get_exchange_rates' : ActorMethod<[], Array<ExchangeRate__1>>,
}