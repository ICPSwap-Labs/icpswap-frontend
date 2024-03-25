import { useEffect, useState, useImperativeHandle, forwardRef, Ref, useRef } from "react";
import { Grid, TextField, Typography, useTheme } from "@mui/material";
import Loading from "components/Loading";
import { isMobile } from "react-device-detect";
import useFileUpload from "hooks/useNFTUpload";
import { getFileType } from "utils/type";
import { t } from "@lingui/macro";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { Identity as CallIdentity } from "types/index";
import Identity, { SubmitLoadingProps, IdentityRef } from "components/Identity";
import CloudUploadIcon from "./UploadCloudIcon";

const useStyles = makeStyles((theme: Theme) => {
  return {
    fileName: {
      padding: "0 40px",
      ...theme.mixins.overflowEllipsis2,
    },
  };
});

export interface UploadProps {
  onUploaded?: (uploadParams: { batch_id: bigint; file_path: string; file_type: string }) => void;
  maxSize?: number;
  accept?: string;
  types?: string[];
  placeholder?: string;
  imageProps?: any;
  beforeUpload?: (file: File) => boolean;
  canisterId: string;
  uploadImmediately?: boolean;
  onFileSelected?: (file: File) => void;
  onFileError?: (error: string) => void;
  disabled?: boolean;
  base64?: boolean;
  uploadWithIdentity?: boolean;
  minHeight?: string;
  [x: string]: any;
}

export interface UploadRef {
  uploadCb: (identity?: CallIdentity) => Promise<
    | {
        filePath: string;
        batchId: bigint;
        fileType: string;
      }
    | undefined
  >;
}

const Upload = forwardRef(
  (
    {
      onUploaded,
      maxSize = 10 * 1024 * 1024,
      accept,
      types = [],
      placeholder,
      imageProps,
      beforeUpload,
      canisterId,
      uploadImmediately = true,
      onFileSelected,
      onFileError,
      disabled,
      base64,
      uploadWithIdentity = false,
      minHeight,
      ...props
    }: UploadProps,
    ref: Ref<UploadRef>,
  ) => {
    const classes = useStyles();
    const theme = useTheme() as Theme;
    const [file, setFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState("");
    const [filePath, setFilePath] = useState("");
    const [fileName, setFileName] = useState("");
    const [fileError, setFileError] = useState("");
    const [imagePreview, setImagePreview] = useState<string>("");
    const [values, uploadCallback] = useFileUpload({
      fileType,
    });

    const identityRef = useRef<IdentityRef>(null);

    const {
      loading: uploadLoading,
      error: uploadError,
      data: { filePath: _filePath, batchId },
    } = values;

    const textFiledProps = {
      ...props,
      defaultValue: undefined,
    };

    useEffect(() => {
      if (_filePath) {
        setFilePath(_filePath);
      }
    }, [_filePath]);

    useEffect(() => {
      if (props.defaultValue) {
        setImagePreview(props.defaultValue);
      }
    }, [props]);

    useEffect(() => {
      if (filePath) {
        setImagePreview(filePath);
        if (onUploaded) {
          onUploaded({
            batch_id: batchId,
            file_path: filePath,
            file_type: fileType,
          });
        }
      }
    }, [filePath, fileType]);

    useEffect(() => {
      if (onFileError) {
        onFileError(fileError);
      }
    }, [fileError]);

    async function uploadCb(identity?: CallIdentity) {
      if (file) {
        return await uploadCallback({
          file,
          identity,
          canisterId,
        });
      }
    }

    useImperativeHandle(
      ref,
      () => ({
        uploadCb,
      }),
      [uploadCallback, file, uploadCb],
    );

    const handleIdentityFileUpload = async (
      identity: CallIdentity,
      { loading }: SubmitLoadingProps,
      { file, canisterId }: any,
    ) => {
      if (loading || !file) return;

      await uploadCallback({
        file: file as File,
        identity,
        canisterId,
      });
    };

    const fileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      event.preventDefault();

      const targetFile = event.target.files?.[0];
      let fileType = getFileType(targetFile?.type ?? "");

      if (fileType === "other" || fileType === "unKnow") {
        const arr = targetFile?.name?.split(".") ?? [];
        fileType = arr[arr.length - 1];
      }

      if (!targetFile) {
        setFileError(t`No file selected`);
        return;
      }

      if (types.length && !types.includes(fileType)) {
        setFileError(t`Not allowed this file type`);
        return;
      }
      setFileError("");

      if (maxSize && targetFile.size > maxSize) {
        setFileError(t`File is large than ${maxSize} bytes`);
        return;
      }
      setFileError("");

      setFileType(fileType);
      setFileName(targetFile.name);
      if (onFileSelected) onFileSelected(targetFile);

      let valid = true;
      if (beforeUpload) valid = beforeUpload(targetFile);
      if (!valid) return;

      setFile(targetFile);

      if (base64) {
        if (fileType === "image") {
          const reader = new FileReader();
          reader.readAsDataURL(targetFile);
          reader.onload = function onload(event) {
            if (event.type === "load") {
              setFilePath(reader.result as string);
            }
          };
        }
      } else if (uploadImmediately) {
        if (uploadWithIdentity) {
          identityRef?.current?.submit({ file: targetFile, canisterId });
        } else {
          uploadCallback({ file: targetFile, canisterId });
        }
      } else if (fileType === "image") {
        const reader = new FileReader();
        reader.readAsDataURL(targetFile);
        reader.onload = function onload(event) {
          if (event.type === "load") {
            setImagePreview(reader.result as string);
          }
        };
      }
    };

    return (
      <Grid
        container
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          width: "100%",
          height: "100%",
          border: "1px dashed #4f5a84",
          borderRadius: "8px",
          position: "relative",
          padding: "10px",
          minHeight: minHeight ?? "auto",
        }}
      >
        {!file ? (
          <CloudUploadIcon />
        ) : fileType === "image" && imagePreview ? (
          <img
            src={imagePreview}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              maxWidth: isMobile ? "140px" : "160px",
              maxHeight: isMobile ? "140px" : "160px",
              ...(imageProps?.style ?? {}),
            }}
          />
        ) : (
          <Typography className={classes.fileName}>{fileName}</Typography>
        )}

        <TextField
          {...textFiledProps}
          sx={{
            display: uploadLoading ? "none" : "block",
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 5,
            top: 0,
            left: 0,
            background: "transparent",
            "& div": {
              background: "transparent",
            },
            "& fieldset": {
              display: "none",
            },
            "& input": {
              opacity: 0,
              height: "100%",
              cursor: "pointer",
              background: "transparent",
            },
            "& label": {
              opacity: 0,
            },
            "& .MuiOutlinedInput-root": {
              width: "100%",
              height: "100%",
            },
          }}
          type="file"
          inputProps={{
            accept,
          }}
          title=""
          onChange={fileUpload}
        />
        {imagePreview === "" && placeholder ? <Typography sx={{ marginTop: "5px" }}>{placeholder}</Typography> : null}
        {!!fileError || !!uploadError ? (
          <Typography mt="4px" sx={{ color: theme.colors.errorMain, textAlign: "center" }}>
            {fileError || uploadError}
          </Typography>
        ) : null}
        {uploadLoading && <Loading loading={uploadLoading} maskBorderRadius="12px" />}
        {uploadWithIdentity ? <Identity ref={identityRef} onSubmit={handleIdentityFileUpload} /> : null}
      </Grid>
    );
  },
);

export default Upload;
