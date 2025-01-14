import { FC } from "react";
import { useMediaQuery, useTheme } from "../Mui";
import DiscordIcon from "./Discord";
import TwitterIcon from "./Twitter";
import TelegramIcon from "./Telegram";
import DistriktIcon from "./Distrikt";
import DscvrIcon from "./Dscvr";
import InstagramIcon from "./Instagram";
import MediumIcon from "./Medium";
import WebsiteIcon from "./Website";
import OtherIcon from "./Other";
import GithubIcon from "./Github";
import OpenChatIcon from "./OpenChat";
import Dashboard from "./Dashboard";
import Explorer from "./Explorer";
import DexScreener from "./DexScreener";

export const Icons: { [key: string]: FC<{ width?: number }> } = {
  Website: WebsiteIcon,
  Discord: DiscordIcon,
  Twitter: TwitterIcon,
  Dscvr: DscvrIcon,
  Distrikt: DistriktIcon,
  Telegram: TelegramIcon,
  Instagram: InstagramIcon,
  Medium: MediumIcon,
  Other: OtherIcon,
  Github: GithubIcon,
  OpenChat: OpenChatIcon,
  Dashboard,
  Explorer,
  DexScreener,
};

export interface MediaLinkIconProps {
  k: string;
  size?: number;
}

export function MediaLinkIcon({ k, size }: MediaLinkIconProps) {
  const Icon = Icons[k];
  const theme = useTheme();

  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

  return Icon ? <Icon width={size ?? (matchDownMd ? 24 : 28)} /> : null;
}
