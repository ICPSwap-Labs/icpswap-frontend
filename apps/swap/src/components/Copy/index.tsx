import { Box, makeStyles } from "components/Mui";
import copyToClipboard from "copy-to-clipboard";
import { TIP_SUCCESS, useTips } from "hooks/useTips";
import { forwardRef, type ReactNode, type Ref, useCallback, useImperativeHandle } from "react";

const useStyles = makeStyles({
  copy: {
    display: "inline-block",
    cursor: "pointer",
    height: "fit-content",
  },
});

export interface CopyRef {
  copy: () => void;
}

export default forwardRef(
  (
    { content, children, hide = false }: { content: string; children?: ReactNode; hide?: boolean },
    ref: Ref<CopyRef>,
  ) => {
    const classes = useStyles();
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
      <Box className={classes.copy} onClick={copy}>
        {children}
      </Box>
    );
  },
);
