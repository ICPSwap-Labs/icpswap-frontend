import { Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Modal from "components/modal/index";
import { parseTokenAmount, enumToString } from "@icpswap/utils";
import { t } from "@lingui/macro";
import upperFirst from "lodash/upperFirst";
import { timestampFormat } from "@icpswap/utils";

const useStyles = makeStyles(() => ({
  titleContainer: {
    position: "relative",
  },
  title: {
    fontSize: "20px",
    fontWeight: 700,
  },
  detailItem: {
    marginBottom: "24px",
  },
  value: {
    textAlign: "right",
    wordBreak: "break-all",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translate(0, -50%)",
  },
}));

const DetailItem = ({ label, value }: { label: string; value: string }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.detailItem}>
      <Grid item xs={4}>
        <Typography>{label}</Typography>
      </Grid>
      <Grid item xs={8} className={classes.value}>
        <Typography color="textPrimary">{value}</Typography>
      </Grid>
    </Grid>
  );
};

const TransferDetail = ({ open, onClose, detail }: { open: boolean; onClose: () => void; detail: any }) => {
  return (
    <Modal title={t`Details`} onClose={onClose} open={open}>
      <DetailItem
        label={t`Amount`}
        value={
          BigInt(detail.amount ?? 0) === BigInt(Number.MAX_VALUE)
            ? "Max Value"
            : parseTokenAmount(detail.amount, detail.decimals).toFormat()
        }
      />
      <DetailItem label={t`Fee`} value={parseTokenAmount(detail.fee, detail.decimals?.toString()).toFormat()} />
      <DetailItem label={t`Type`} value={upperFirst(enumToString(detail.transType))} />
      <DetailItem label={t`Time`} value={timestampFormat(detail.timestamp)} />
      <DetailItem label={t`From`} value={detail.from} />
      <DetailItem label={t`To`} value={detail.to} />
      <DetailItem label={t`Hash`} value={detail.hash} />
    </Modal>
  );
};

export default TransferDetail;
