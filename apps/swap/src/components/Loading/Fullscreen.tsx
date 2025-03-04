import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { closeLoading } from "store/loadingReducer";
import LoadingImage from "assets/images/loading.png";
import { makeStyles, Theme, Backdrop } from "components/Mui";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1301,
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  backdrop: {
    zIndex: 10000,
    color: "#fff",
  },
}));

export default function FullscreenLoading({
  maskClosable,
  onMaskClick,
}: {
  maskClosable?: boolean;
  onMaskClick?: () => void;
}) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const loadingInitial = useAppSelector((state) => state.loading);

  const onClick = () => {
    if (maskClosable) {
      dispatch(closeLoading());
    }

    if (onMaskClick) onMaskClick();
  };

  useEffect(() => {
    setOpen(loadingInitial.open);
  }, [loadingInitial.open]);

  return (
    <Backdrop className={classes.backdrop} open={open} onClick={onClick}>
      <img width="80px" height="80px" src={LoadingImage} alt="" />
    </Backdrop>
  );
}
