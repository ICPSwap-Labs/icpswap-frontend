import { Grid } from "@mui/material";

interface FilledImageProps {
  Icon: any;
  theme?: string;
  height?: string;
  sx?: { [key: string]: any };
}

export default function FilledImage({ Icon, theme, height, ...props }: FilledImageProps) {
  return (
    <Grid
      {...props}
      sx={{
        width: "100%",
        ...(height ? { height } : { paddingTop: "100%" }),
        position: "relative",
        ...(props.sx || {}),
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          background: theme === "dark" ? "#29314F" : "#e3e3e3",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* @ts-ignore */}
        <Icon {...props} />
      </Grid>
    </Grid>
  );
}
