import type React from "react";
import { InfoLayout } from "../info/InfoLayout";
import { MainLayout } from "./MainLayout";

export interface LayoutProps {
  children: React.ReactNode;
  info: boolean;
}

export function Layout({ info, children }: LayoutProps) {
  return <MainLayout>{info ? <InfoLayout>{children}</InfoLayout> : children}</MainLayout>;
}
