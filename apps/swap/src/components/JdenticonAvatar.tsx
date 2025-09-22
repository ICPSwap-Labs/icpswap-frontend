import { Box, useTheme } from "components/Mui";
import Jdenticon from "react-jdenticon";

export interface JdenticonAvatarProps {
  value: string;
  size?: number;
}

export function JdenticonAvatar({ value, size = 48 }: JdenticonAvatarProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        position: "relative",
        border: `1px solid ${theme.colors.secondaryMain}`,
      }}
    >
      <Box
        sx={{
          width: `${size - 4}px`,
          height: `${size - 4}px`,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Jdenticon size={`${size - 4}`.toString()} value={value} />
      </Box>
    </Box>
  );
}
