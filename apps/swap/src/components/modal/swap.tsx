import React from "react";
import { useTheme } from "components/Mui";
import { isDarkTheme } from "utils";

import Modal from "./index";

export interface SwapModalProps {
  width?: string;
  open: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

export default ({ width = "570px", open, children, ...props }: SwapModalProps) => {
  const theme = useTheme();

  return (
    <Modal
      open={open}
      maxWidth="lg"
      {...props}
      dialogProps={{
        sx: {
          "& .MuiDialog-paper": {
            width,
            backgroundColor: isDarkTheme(theme) ? theme.palette.background.level2 : theme.colors.lightGray200,
          },
          ...(props.dialogProps?.sx || {}),
        },
      }}
    >
      {children}
    </Modal>
  );
};
