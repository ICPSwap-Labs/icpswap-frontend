import copyToClipboard from "copy-to-clipboard";
import React, { forwardRef, useImperativeHandle } from "react";

import { Box } from "./Mui";

export interface CopyProps {
  content: string | undefined;
  children: React.ReactNode;
  hide?: boolean;
  onCopy?: () => void;
}

export const Copy = forwardRef(({ content, children, hide, onCopy }: CopyProps, ref) => {
  const copy = () => {
    if (!content) return;
    copyToClipboard(content);
    if (onCopy) onCopy();
  };

  useImperativeHandle(
    ref,
    () => ({
      copy,
    }),
    [copy],
  );

  return !hide ? (
    <Box sx={{ display: "inline-block", cursor: "pointer" }} onClick={copy}>
      {children}
    </Box>
  ) : null;
});
