import React, { useEffect } from "react";
import * as Sentry from "@sentry/react";
import { Grid, Box, Typography } from "@mui/material";
import ErrorImage from "assets/images/Error";
import { Layout } from "components/Layout/index";
import { Trans } from "@lingui/macro";
import copy from "copy-to-clipboard";

interface FallbackProps {
  error: Error;
  eventId: string | number | null;
}

function Fallback({ error, eventId }: FallbackProps) {
  const handleCopyError = () => {
    copy(`${error?.toString() ?? ""}_${eventId}`);
  };

  useEffect(() => {
    if (error) {
      const errorString = error.toString();
      if (/Loading chunk *.{1,} failed./.test(errorString) || /Unexpected token '<'/.test(errorString)) {
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <Layout info={false}>
      <Box sx={{ width: "100%", height: "calc(100vh - 280px)" }}>
        <Grid container alignItems="center" justifyContent="center" sx={{ width: "100%", height: "100%" }}>
          <Grid item>
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
              <Typography color="text.primary" align="center" sx={{ fontSize: "24px", margin: "0 0 20px 0" }}>
                <Trans>Oops, you've encountered an error</Trans>
              </Typography>

              <ErrorImage />

              <Box
                sx={{
                  width: "374px",
                  height: "182px",
                  background: "rgba(17, 25, 54, 0.2)",
                  borderRadius: "8px",
                  padding: "24px",
                }}
              >
                <Box sx={{ height: "112px", overflow: "hidden" }}>
                  <Typography color="text.primary" fontSize="12px" sx={{ wordBreak: "break-word" }}>
                    {error.toString()}
                  </Typography>

                  <Typography color="text.primary" fontSize="12px" sx={{ wordBreak: "break-word" }}>
                    {eventId}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "42px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "10px",
                    background: "#4F5A84",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={handleCopyError}
                >
                  <Typography color="text.primary" fontSize="12px">
                    <Trans>Copy</Trans>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    // @ts-ignore
    <Sentry.ErrorBoundary fallback={({ error, eventId }) => <Fallback error={error} eventId={eventId} />}>
      {children}
    </Sentry.ErrorBoundary>
  );
}
