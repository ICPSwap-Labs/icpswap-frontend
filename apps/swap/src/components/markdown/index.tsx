import React, { useEffect, useRef, useState } from "react";
import { Grid, Box, Input, Typography, CircularProgress, useTheme, makeStyles, Theme } from "components/Mui";
import useVotingImageUpload from "hooks/useVotingImageUpload";
import { getFileType } from "utils/type";
import { useErrorTip } from "hooks/useTips";
import { UploadCloud } from "react-feather";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) => {
  return {
    textarea: {
      background: "transparent",
      width: "100% !important",
      border: "none",
      minHeight: "180px",
      outline: "none",
      color: theme.palette.text.secondary,
      font: "inherit",
      padding: "0 10px",
    },
  };
});

const fileSizeCheck = (limit: number, file: File) => {
  if (file.size > limit) return false;
  return true;
};

export default function Markdown({
  limit = 14400,
  onChange,
  maxFileSize = 2 * 1024 * 1024,
  fileCanisterId,
  projectId,
}: {
  limit?: number;
  maxFileSize?: number;
  onChange?: (value: string) => void;
  fileCanisterId: string;
  projectId: string;
}) {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme() as Theme;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [openErrorTip] = useErrorTip();

  const [value, setValue] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [uploadResult, upload] = useVotingImageUpload();

  const injectImageToBody = (path: string) => {
    const cursorPosition = textareaRef.current?.selectionStart;

    const currentValue = value;
    const currentBodyWithImage = `${currentValue?.substring(0, cursorPosition)} \n![${file?.name}](${path})
      ${currentValue?.substring(cursorPosition as number)}`;

    setValue(currentBodyWithImage);
    if (onChange) onChange(currentBodyWithImage);
  };

  useEffect(() => {
    if (!uploadResult.loading && !!uploadResult.data.filePath) {
      injectImageToBody(uploadResult.data.filePath);
    }
  }, [uploadResult.data.filePath]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (uploadResult.loading) return;

    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const item = e.dataTransfer.files[i];
      if (item.type.startsWith("image/")) {
        if (!fileSizeCheck(maxFileSize, item)) {
          openErrorTip(t`File size limit is 2M`);
          return;
        }
        setFile(item);
        upload({
          file: item,
          canisterId: fileCanisterId,
          projectId,
        });
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (uploadResult.loading) return;
    for (let i = 0; i < e.clipboardData.items.length; ++i) {
      const item = e.clipboardData.items[i];
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();

        if (file && !fileSizeCheck(maxFileSize, file)) {
          openErrorTip(t`File size limit is 2M`);
          return;
        }

        if (file) {
          setFile(file);
          upload({
            projectId,
            file,
            canisterId: fileCanisterId,
          });
        }
      }
    }
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    if (onChange) onChange(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadResult.loading) return;

    event.preventDefault();

    const targetFile = event.target.files?.[0];
    const fileType = getFileType(targetFile?.type ?? "");

    if (targetFile && !fileSizeCheck(maxFileSize, targetFile)) {
      openErrorTip(t`File size limit is 2M`);
      return;
    }

    if (!targetFile || fileType !== "image") return;

    setFile(targetFile);
    upload({
      projectId,
      file: targetFile,
      canisterId: fileCanisterId,
    });
  };

  return (
    <Box>
      <Grid container justifyContent="space-between">
        <Typography>{t("common.description")}</Typography>
        <Typography>
          {value.length}/{limit}
        </Typography>
      </Grid>

      <Box
        sx={{
          borderRadius: "8px",
          border: `1px solid ${theme.palette.background.level4}`,
          marginTop: "10px",
          padding: "5px 0 0 0",
        }}
      >
        <Box onDrop={handleDrop}>
          <textarea
            ref={textareaRef}
            maxLength={limit}
            onPaste={handlePaste}
            className={classes.textarea}
            onChange={handleTextareaChange}
            value={value}
          />
        </Box>

        <Box
          sx={{
            position: "relative",
            cursor: "pointer",
            borderTop: `1px solid ${theme.palette.background.level4}`,
            minHeight: "32px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Input
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              "& input": {
                cursor: "pointer",
              },
            }}
            inputProps={{
              accept: "image/jpg, image/jpeg, image/png",
              type: "file",
            }}
            onChange={handleFileChange}
            disabled={uploadResult.loading}
          />

          {uploadResult.loading ? (
            <Grid
              container
              alignItems="center"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "32px",
                zIndex: 1,
                padding: "0 10px",
              }}
            >
              <CircularProgress size={18} sx={{ color: theme.palette.text.secondary }} />

              <Typography
                sx={{
                  fontSize: "12px",
                  marginLeft: "10px",
                }}
              >
                {t("markdown.uploading.image")}
              </Typography>
            </Grid>
          ) : (
            <Typography
              sx={{
                width: "100%",
                padding: "0 10px",
                fontSize: "12px",
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "@media (max-width:520px)": {
                    transform: "scale(0.8)",
                  },
                }}
              >
                {t("markdown.file.select")}
                <Box sx={{ width: "5px" }} />
                <UploadCloud size={14} strokeWidth={2} />
              </Box>
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
