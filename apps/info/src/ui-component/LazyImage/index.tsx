import React, { useState, useEffect, useRef } from "react";
import { Grid, Box } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import ErrorImage from "@mui/icons-material/BrokenImage";
import { Theme } from "@mui/material/styles";
import { LoadingDarkImage } from "./LoadingDarkImage";
import { LoadingLightImage } from "./LoadingLightImage";
import { DefaultDarkImage } from "./DefaultDarkImage";
import { DefaultLightImage } from "./DefaultLightImage";

const useStyle = makeStyles(() => ({
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    width: "auto",
    height: "auto",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  defaultImage: {
    marginTop: "-100%",
  },
}));

export interface LazyImageProps {
  animationDuration?: number;
  aspectRatio?: number;
  /** Override the background color. */
  color?: string;
  /** Disables the error icon if set to true. */
  disableError?: boolean;
  /** Disables the loading spinner if set to true. */
  disableSpinner?: boolean;
  /** Disables the transition after load if set to true. */
  disableTransition?: boolean;
  /** Override the inline-styles of the image. */
  imageStyle?: { [key: string]: any };
  /** Override the loading component. */
  loading?: React.ReactNode;
  /** Fired when the user clicks on the image happened. */
  onClick?: () => void;
  /** Fired when the image failed to load. */
  onError?: (event: any) => void;
  /** Fired when the image finished loading. */
  onLoad?: (event: any) => void;
  /** Specifies the URL of an image. */
  src: string;
  /** always show default image */
  showDefault?: boolean;

  boxSX?: { [key: string]: any };

  height?: string;

  CustomImage?: React.ReactNode;
}

export default function LazyImage(props: LazyImageProps) {
  const theme = useTheme() as Theme;
  const classes = useStyle();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const image = useRef<HTMLImageElement>(null);

  const handleLoadImage = (e?: any) => {
    setImageError(false);
    setImageLoaded(true);
    if (props.onLoad) {
      props.onLoad(e);
    }
  };

  const handleImageError = (e?: any) => {
    if (props.src) {
      setImageError(true);

      if (props.onError) {
        props.onError(e);
      }
    }
  };

  const {
    animationDuration = 3000,
    disableTransition = false,
    onClick,
    showDefault = false,
    height,
    boxSX,
    CustomImage,
    ...imageProps
  } = props;

  const imageTransition = !disableTransition && {
    opacity: imageLoaded ? 1 : 0,
    filterBrightness: imageLoaded ? 100 : 0,
    filterSaturate: imageLoaded ? 100 : 20,
    transition: `
      filterBrightness ${animationDuration * 0.75}ms cubic-bezier(0.4, 0.0, 0.2, 1),
      filterSaturate ${animationDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1),
      opacity ${animationDuration / 2}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
  };

  useEffect(() => {
    if (props.showDefault) return;
    const img = image.current;
    if (img && img.complete) {
      // image loaded before the component rendered (e.g. SSR), see #43 and #51
      if (img.naturalWidth === 0) {
        handleImageError();
      } else {
        handleLoadImage();
      }
    }
  }, [props.showDefault]);

  return (
    <Grid container justifyContent="center" sx={{ position: "relative", overflow: "hidden" }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          ...(height ? { height } : { height: "0px", paddingTop: "100%" }),
          display: imageLoaded ? "block" : "none",
          ...(boxSX || {}),
        }}
        onClick={onClick}
      >
        {imageProps.src && !showDefault && !CustomImage && (
          <img
            src={imageProps.src}
            ref={image}
            style={{
              ...imageTransition,
              display: imageLoaded ? "block" : "none",
            }}
            className={classes.image}
            onLoad={handleLoadImage}
            onError={handleImageError}
            alt=""
          />
        )}
      </Box>
      {!imageLoaded &&
        !showDefault &&
        !CustomImage &&
        (theme.customization.navType === "dark" ? (
          <LoadingDarkImage height={height} sx={imageLoaded ? { marginTop: "-100%" } : {}} />
        ) : (
          <LoadingLightImage height={height} sx={imageLoaded ? { marginTop: "-100%" } : {}} />
        ))}
      {imageLoaded && imageError && <ErrorImage sx={{ marginTop: "-100%" }} />}
      {showDefault &&
        !CustomImage &&
        (theme.customization.navType === "dark" ? (
          <DefaultDarkImage height={height} sx={imageLoaded ? { marginTop: "-100%" } : {}} />
        ) : (
          <DefaultLightImage height={height} sx={imageLoaded ? { marginTop: "-100%" } : {}} />
        ))}
      {CustomImage ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            ...(height ? { height } : { paddingTop: "100%" }),
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
            }}
          >
            {CustomImage}
          </Box>
        </Box>
      ) : null}
    </Grid>
  );
}
