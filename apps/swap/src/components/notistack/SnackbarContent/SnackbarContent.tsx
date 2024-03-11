import { forwardRef } from "react";
import clsx from "clsx";
import { SnackbarContentProps } from "../types";
import { breakpoints } from "../utils";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1,
    [breakpoints.upSm]: {
      flexGrow: "initial",
      minWidth: "288px",
    },
  },
});

const SnackbarContent = forwardRef<HTMLDivElement, SnackbarContentProps>(({ className, ...props }, ref) => {
  const classes = useStyles();
  return <div ref={ref} className={clsx(classes.root, className)} {...props} />;
});

export default SnackbarContent;
