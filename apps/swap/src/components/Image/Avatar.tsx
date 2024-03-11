import { Avatar, AvatarProps } from "@mui/material";

export default function AvatarImage(props: AvatarProps) {
  return (
    <Avatar {...props} sx={{ background: "#111936", ...(props.sx ?? {}) }}>
      &nbsp;
    </Avatar>
  );
}
