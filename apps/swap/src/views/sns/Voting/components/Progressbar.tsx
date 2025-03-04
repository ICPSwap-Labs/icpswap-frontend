import { Box, useTheme } from "components/Mui";

export interface ProgressbarProps {
  yes: number | undefined;
  no: number | undefined;
  YesColor: string;
  NoColor: string;
  standardMajorityPercent: number | undefined;
  immediateMajorityPercent: number | undefined;
}

export function Progressbar({
  yes,
  no,
  YesColor,
  NoColor,
  immediateMajorityPercent,
  standardMajorityPercent,
}: ProgressbarProps) {
  const theme = useTheme();

  return (
    <Box sx={{ position: "relative", width: "100%", height: "10px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "10px",
          borderRadius: "12px",
          background: theme.palette.background.level3,
        }}
      >
        <Box
          sx={{
            width: yes,
            height: "100%",
            borderTopLeftRadius: "12px",
            borderBottomLeftRadius: "12px",
            background: YesColor,
          }}
        />

        <Box
          sx={{
            width: no,
            height: "100%",
            borderTopRightRadius: "12px",
            borderBottomRightRadius: "12px",
            background: NoColor,
          }}
        />
      </Box>
      <Box sx={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0 }}>
        {immediateMajorityPercent ? (
          <Box
            className="immediate-majority"
            sx={{
              position: "absolute",
              bottom: 0,
              left: `${immediateMajorityPercent}%`,
              width: "2px",
              height: "16px",
              background: "#ffffff",
              transform: "translate(-50%, 0)",
              "&: after": {
                display: "block",
                position: "absolute",
                top: "-5px",
                left: "-2px",
                content: '" "',
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: theme.colors.primaryMain,
              },
            }}
          />
        ) : null}

        {standardMajorityPercent ? (
          <Box
            className="standard-majority"
            sx={{
              position: "absolute",
              bottom: 0,
              left: `${standardMajorityPercent}%`,
              width: "2px",
              height: "16px",
              background: "#ffffff",
              transform: "translate(-50%, 0)",
              "&: after": {
                display: "block",
                position: "absolute",
                top: "-5px",
                left: "-2px",
                content: '" "',
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: theme.colors.secondaryMain,
              },
            }}
          />
        ) : null}
      </Box>
    </Box>
  );
}
