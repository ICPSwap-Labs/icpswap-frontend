import copyToClipboard from "copy-to-clipboard";
import React, { forwardRef, useImperativeHandle } from "react";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTips, TIP_SUCCESS } from "hooks/useTips";

const useStyles = makeStyles({
  copy: {
    display: "inline-block",
    cursor: "pointer",
  },
});

const Copy = forwardRef(
  ({ content, children, hide }: { content: string | undefined; children: React.ReactChild; hide?: boolean }, ref) => {
    const classes = useStyles();
    const [openTips] = useTips();

    const copy = () => {
      if (!content) return;
      copyToClipboard(content);
      openTips("Copy Successfully", TIP_SUCCESS);
    };

    useImperativeHandle(
      ref,
      () => ({
        copy: copy,
      }),
      [copy],
    );

    return !hide ? (
      <Box className={classes.copy} onClick={copy}>
        {children}
      </Box>
    ) : null;
  },
);

export default Copy;
