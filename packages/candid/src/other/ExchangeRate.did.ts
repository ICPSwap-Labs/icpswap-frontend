export const idlFactory = ({ IDL }: any) => {
  const AssetClass = IDL.Variant({
    Cryptocurrency: IDL.Null,
    FiatCurrency: IDL.Null
  });
  const Asset = IDL.Record({ class: AssetClass, symbol: IDL.Text });
  const ExchangeRateError = IDL.Variant({
    AnonymousPrincipalNotAllowed: IDL.Null,
    CryptoQuoteAssetNotFound: IDL.Null,
    FailedToAcceptCycles: IDL.Null,
    ForexBaseAssetNotFound: IDL.Null,
    CryptoBaseAssetNotFound: IDL.Null,
    StablecoinRateTooFewRates: IDL.Null,
    ForexAssetsNotFound: IDL.Null,
    InconsistentRatesReceived: IDL.Null,
    RateLimited: IDL.Null,
    StablecoinRateZeroRate: IDL.Null,
    Other: IDL.Record({ code: IDL.Nat32, description: IDL.Text }),
    ForexInvalidTimestamp: IDL.Null,
    NotEnoughCycles: IDL.Null,
    ForexQuoteAssetNotFound: IDL.Null,
    StablecoinRateNotFound: IDL.Null,
    Pending: IDL.Null
  });
  const Error = IDL.Record({
    message: ExchangeRateError,
    timestamp: IDL.Int
  });
  const ExchangeRate__1 = IDL.Record({
    decimals: IDL.Nat32,
    rate: IDL.Nat64,
    error: IDL.Opt(Error),
    timestamp: IDL.Nat64,
    quote_symbol: IDL.Text,
    quote_class: IDL.Text,
    base_symbol: IDL.Text,
    base_class: IDL.Text
  });
  return IDL.Service({
    add_asset: IDL.Func([Asset, Asset], [], []),
    force_update_rate: IDL.Func([], [], []),
    get_assets: IDL.Func([], [IDL.Vec(IDL.Tuple(Asset, Asset))], ["query"]),
    get_exchange_rate: IDL.Func([IDL.Text], [ExchangeRate__1], ["query"]),
    get_exchange_rates: IDL.Func([], [IDL.Vec(ExchangeRate__1)], ["query"])
  });
};
