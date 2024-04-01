import { useLocation } from "react-router-dom";
import React from "react";
import { MainLayout } from "./MainLayout";

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return location.pathname.includes("swap-pro") ? <>{children}</> : <MainLayout>{children}</MainLayout>;
}
