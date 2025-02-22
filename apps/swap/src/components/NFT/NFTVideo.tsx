import { Grid, Box } from "components/Mui";
import { useEffect, useState } from "react";
import { DefaultDarkImage } from "components/LazyImage/DefaultDarkImage";

export default function NFTVideo({
  src,
  onClick,
  autoPlay,
}: {
  autoPlay?: boolean;
  src: string | undefined;
  onClick?: () => void;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (src) {
      const video = document.getElementById("NFT_Video") as HTMLVideoElement;

      if (video) {
        video.addEventListener(
          "loadeddata",
          () => {
            setLoading(false);
            if (autoPlay) video.play();
          },
          false,
        );
      }
    }
  }, [src]);

  return (
    <Grid container justifyContent="center" sx={{ position: "relative", overflow: "hidden" }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          padding: loading ? 0 : "5px",
        }}
        onClick={onClick}
      >
        <video
          id="NFT_Video"
          controls
          loop
          muted={!!autoPlay}
          style={{ display: loading ? "none" : "block", width: "100%", height: "100%" }}
        >
          <source src={src} type="video/mp4" />
        </video>

        {loading ? <DefaultDarkImage sx={{ marginTop: loading ? 0 : "-100%" }} /> : null}
      </Box>
    </Grid>
  );
}
