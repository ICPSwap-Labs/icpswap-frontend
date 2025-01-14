import React from "react";
import { MainLayout } from "./MainLayout";
import { InfoLayout } from "../info/InfoLayout";

export interface LayoutProps {
  children: React.ReactNode;
  info: boolean;
}

export function Layout({ info, children }: LayoutProps) {
  return <MainLayout>{info ? <InfoLayout>{children}</InfoLayout> : children}</MainLayout>;
}
