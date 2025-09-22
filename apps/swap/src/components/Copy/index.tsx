import copyToClipboard from "copy-to-clipboard";
import { ReactNode, forwardRef, useImperativeHandle, Ref } from "react";
import { Box, makeStyles } from "components/Mui";
import { useTips, TIP_SUCCESS } from "hooks/useTips";

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

    const copy = () => {
      copyToClipboard(content);
      openTips("Copy Success", TIP_SUCCESS);
    };

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
