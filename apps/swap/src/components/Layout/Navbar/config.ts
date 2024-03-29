import { INFO_URL } from "constants/index";
import TwitterIcon from "./icons/Twitter";
import TelegramIcon from "./icons/Telegram";
import DiscordIcon from "./icons/Discord";
import WebsiteIcon from "./icons/Website";
import MediumIcon from "./icons/Medium";
import GithubIcon from "./icons/Github";
import GitbookIcon from "./icons/Gitbook";
import DSCVRIcon from "./icons/DSCVR";
import { version } from "../../../.version";

export type Route = {
  name: string;
  path?: string;
  link?: string;
  subMenus?: SubMenu[];
  key: string;
  icon?: () => JSX.Element;
  disabled?: boolean;
};

export type SubMenu = Route;

export const MAX_NUMBER = 5;

export const routes: Route[] = [
  {
    key: "swap",
    name: `Swap`,
    path: "/swap",
  },
  {
    key: "staking-token",
    name: `Token Pools`,
    path: `/staking-token`,
  },
  {
    key: "staking-farm",
    name: `Farms`,
    path: `/staking-farm`,
  },
  {
    key: "marketplace",
    name: `Marketplace`,
    // path: "/marketplace/NFT",
    path: "/marketplace/collections",
  },
  {
    key: "wallet",
    name: `Wallet`,
    path: `/wallet`,
  },
  {
    key: "sns",
    name: `SNS Launchpad`,
    path: `/sns/launch/csyra-haaaa-aaaaq-aacva-cai`,
  },
  {
    key: "voting",
    name: `Voting`,
    path: `/voting`,
  },
  {
    key: "console",
    name: `Console`,
    path: `/console`,
  },
  {
    key: "info",
    name: `Info`,
    link: INFO_URL,
  },
  {
    key: "followUS",
    name: `Follow US`,
    subMenus: [
      { key: "followUS_twitter", name: `Twitter`, link: "https://twitter.com/ICPSwap", icon: TwitterIcon },
      { key: "followUS_Telegram", name: `Telegram`, link: "https://t.me/ICPSwap_Official", icon: TelegramIcon },
      {
        key: "followUS_DSCVR",
        name: `DSCVR`,
        link: "https://h5aet-waaaa-aaaab-qaamq-cai.raw.ic0.app/p/icpswap",
        icon: DSCVRIcon,
      },
      { key: "followUS_Medium", name: `Medium`, link: "https://icpswap.medium.com/", icon: MediumIcon },
      { key: "followUS_Gitbook", name: `Gitbook`, link: "https://iloveics.gitbook.io/icpswap/", icon: GitbookIcon },
      { key: "followUS_Github", name: `Github`, link: "https://github.com/ICPSwap-Labs", icon: GithubIcon },
      { key: "followUS_Discord", name: `Discord`, link: "https://discord.gg/UFDTQkBfEB", icon: DiscordIcon },
      { key: "followUS_Website", name: `Website`, link: "http://icpswap.com/", icon: WebsiteIcon },
    ],
  },
  {
    key: "feedback",
    name: "Feedback",
    link: "https://forms.gle/E1WAEfemwDBnLmY66",
  },
  {
    key: "wrap",
    name: "WICP",
    path: "/swap/v2/wrap",
  },
  {
    key: "version",
    name: `Version ${version}`,
    path: "",
    disabled: true,
  },
];
