import React from "react";
import { MainLayout } from "./MainLayout";

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
