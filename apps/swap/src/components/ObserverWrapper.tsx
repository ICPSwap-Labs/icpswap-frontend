import type { Null } from "@icpswap/types";
import { Box, type BoxProps } from "components/Mui";
import type React from "react";
import { useEffect, useRef, useState } from "react";

export interface ObserverWrapperProps {
  children: React.ReactNode;
  beforeClass?: string;
  afterClass?: string;
  props?: BoxProps;
  scrollInViewport?: () => void;
  scrollOutViewport?: () => void;
}

export function ObserverWrapper({
  children,
  beforeClass = "before-translate",
  afterClass = "after-translate",
  props,
  scrollInViewport,
  scrollOutViewport,
}: ObserverWrapperProps) {
  const eleRef = useRef<HTMLDivElement>(null);

  const [inViewport, setInViewport] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | Null = null;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target === eleRef.current) {
          setInViewport(true);
          if (scrollInViewport) scrollInViewport();
          return;
        }

        if (scrollOutViewport) {
          scrollOutViewport();
        }
      });
    };

    const options = {
      root: null,
      // 64px is the Header height
      rootMargin: "-64px 0px 0px 0px",
      threshold: 0,
    };

    observer = new IntersectionObserver(observerCallback, options);

    if (eleRef.current && observer) {
      observer.observe(eleRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [scrollInViewport, scrollOutViewport]);

  return (
    <Box ref={eleRef} className={`${beforeClass} ${inViewport ? afterClass : ""}`} sx={props?.sx}>
      {children}
    </Box>
  );
}
