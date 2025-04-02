import { Avatar, AvatarProps } from "components/Mui";

export default function AvatarImage(props: AvatarProps) {
  return (
    <Avatar {...props} sx={{ background: "#111936", ...(props.sx ?? {}) }}>
      &nbsp;
    </Avatar>
  );
}
