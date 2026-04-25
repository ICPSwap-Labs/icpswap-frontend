import { LinearProgress, styled, Typography } from "../Mui";

const Root = styled("div")({
  width: "100%",
  height: "100%",
});

const Loader = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1301,
  width: "100%",
  "& > * + *": {
    marginTop: 16,
  },
});

const ImageBox = styled("div")({
  padding: "120px 0 0 0",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export function LinearLoader() {
  return (
    <Root>
      <Loader>
        <LinearProgress color="primary" />
      </Loader>
      <ImageBox>
        <img src="/images/loading-page.gif" alt="loading" width="200px" height="200px" />
        <Typography sx={{ color: "text.primary", fontSize: "16px" }}>Loading… Please wait.</Typography>
      </ImageBox>
    </Root>
  );
}
