import { Box } from "components/Mui";
import copyToClipboard from "copy-to-clipboard";
import { TIP_SUCCESS, useTips } from "hooks/useTips";
import { forwardRef, type ReactNode, type Ref, useCallback, useImperativeHandle } from "react";

export interface CopyRef {
  copy: () => void;
}

export default forwardRef(
  (
    { content, children, hide = false }: { content: string; children?: ReactNode; hide?: boolean },
    ref: Ref<CopyRef>,
  ) => {
    const [openTips] = useTips();

    const copy = useCallback(() => {
      copyToClipboard(content);
      openTips("Copy Success", TIP_SUCCESS);
    }, [content, openTips]);

    useImperativeHandle(
      ref,
      () => ({
        copy,
      }),
      [copy],
    );

    return hide ? null : (
      <Box
        sx={{
          display: "inline-block",
          cursor: "pointer",
          height: "fit-content",
        }}
        onClick={copy}
      >
        {children}
      </Box>
    );
  },
);
