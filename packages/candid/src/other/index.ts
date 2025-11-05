export { idlFactory as ExchangeRateInterfaceFactory } from "./ExchangeRate.did";
export type { _SERVICE as ExchangeRate } from "./ExchangeRate";

export { idlFactory as LiquidityLocksInterfaceFactory } from "./LiquidityLocks.did";
export type { _SERVICE as LiquidityLocksService } from "./LiquidityLocks";

export { idlFactory as SettingInterfaceFactory } from "./setting.did";
export type { _SERVICE as SettingService } from "./setting";

export { idlFactory as SocialMediaInterfaceFactory } from "./SocialMedia.did";
export type { _SERVICE as SocialMediaService, ICSNews as SocialMediaResult } from "./SocialMedia";

export { idlFactory as AddressBookFactory } from "./AddressBook.did";
export type { _SERVICE as AddressBookService, AddressBook } from "./AddressBook";

export type { _SERVICE as PriceAlertsService, AlertInfo, AlertType, AddAlert as AddAlertArgs } from "./PriceAlerts";
export { idlFactory as PriceAlertsFactory } from "./PriceAlerts.did";
