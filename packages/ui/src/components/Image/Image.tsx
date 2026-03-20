import { Avatar, type AvatarProps } from "../Mui";

export function Image(props: AvatarProps) {
  return (
    <Avatar {...props} sx={{ background: "transparent", ...(props.sx ?? {}) }}>
      &nbsp;
    </Avatar>
  );
}
