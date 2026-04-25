import type { FC } from "react";
import { useMediaQuery, useTheme } from "../Mui";
import Dashboard from "./Dashboard";
import DexScreener from "./DexScreener";
import DiscordIcon from "./Discord";
import DistriktIcon from "./Distrikt";
import DscvrIcon from "./Dscvr";
import Explorer from "./Explorer";
import GithubIcon from "./Github";
import InstagramIcon from "./Instagram";
import MediumIcon from "./Medium";
import OpenChatIcon from "./OpenChat";
import OtherIcon from "./Other";
import TelegramIcon from "./Telegram";
import TwitterIcon from "./Twitter";
import WebsiteIcon from "./Website";

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
