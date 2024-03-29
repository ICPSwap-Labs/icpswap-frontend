import { useLocation } from "react-router-dom";
import React from "react";
import { MainLayout } from "./MainLayout";
import { SwapProLayout } from "./ProLayout";

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return location.pathname.includes("swap-pro") ? (
    <SwapProLayout>{children}</SwapProLayout>
  ) : (
    <MainLayout>{children}</MainLayout>
  );
}
