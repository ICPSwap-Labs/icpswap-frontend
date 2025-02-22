/* eslint-disable no-param-reassign */
import { useState, useEffect } from "react";
import { TextField, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const useStyles = makeStyles(() => {
  return {
    box: {
      width: "100%",
      height: "100%",
      position: "relative",
      border: "1px dashed #4f5a84",
      borderRadius: "8px",
    },
    input: {
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: "10",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "block",
      "& *": {
        background: "none",
      },
      "& fieldset": {
        border: "none",
      },
      "& .MuiInputBase-root": {
        height: "100%",
      },
      "& input": {
        padding: "0",
        opacity: "0",
        height: "100%",
        cursor: "pointer",
      },
      "& label": {
        opacity: "0",
      },
    },
    logo: {
      width: "80px",
      height: "80px",
      margin: "16px 0",
    },
  };
});

export type UploadType = {
  status: boolean;
  result: number;
  message: string;
};

export default function Upload({
  onChange,
  defaultValue,
  ...props
}: {
  onChange: (values: any) => void;
  defaultValue: string;
  fullWidth?: boolean;
}) {
  const classes = useStyles();
  const [imagePreview, setImagePreview] = useState<string>("");

  const textFieldProps = {
    ...props,
    defaultValue: undefined,
  };

  useEffect(() => {
    if (defaultValue) setImagePreview(defaultValue);
  }, [defaultValue]);

  const _handleReaderLoaded = (binaryString: string, type: string) => {
    const _base64 = btoa(binaryString);
    if (onChange) onChange(type + _base64);
  };

  const photoUpload = (e: any) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    if (file && file.size / 1024 > 100) {
      if (onChange) {
        onChange({
          status: false,
          result: 10400,
          message: "no more than 100K",
        });
      }

      // reset input value
      e.target.value = null;
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvt: any) => {
        _handleReaderLoaded(readerEvt.target.result, `data:${file.type};base64,`);
      };
      reader.readAsBinaryString(file);
    }

    if (reader !== undefined && file !== undefined) {
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Grid container flexDirection="column" justifyContent="center" alignItems="center" className={classes.box}>
      {imagePreview === "" ? (
        <CloudUploadIcon sx={{ fontSize: "84px" }} />
      ) : (
        <img className={classes.logo} src={imagePreview} alt="" />
      )}
      <TextField
        className={classes.input}
        fullWidth
        {...textFieldProps}
        type="file"
        inputProps={{
          accept: ".jpeg, .png, .jpg, .gif",
        }}
        title=""
        onChange={photoUpload}
      />
      {imagePreview === "" ? <Typography mb={2}>Drop your logo here(less than 100K)</Typography> : null}
    </Grid>
  );
}
