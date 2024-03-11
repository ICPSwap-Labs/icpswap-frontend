// @ts-ignore
import Jdenticon from "react-jdenticon";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  avatar: {
    position: "absolute",
    borderRadius: "50%",
    overflow: "hidden",
  },
  avatarBg: {
    position: "relative",
    zIndex: 124,
  },
});
function AvatarBg() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="37" stroke="url(#paint0_linear)" strokeWidth="2" />
      <circle cx="40" cy="40" r="39" stroke="url(#paint1_linear)" strokeWidth="2" />
      <circle opacity="0.1" cx="40" cy="40" r="30" fill="#65729E" />
      <defs>
        <linearGradient id="paint0_linear" x1="11" y1="17" x2="57.6924" y2="64.279" gradientUnits="userSpaceOnUse">
          <stop stopColor="#29314F" stopOpacity="0" />
          <stop offset="1" stopColor="#8572FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="9.47368"
          y1="15.7895"
          x2="58.6236"
          y2="65.5568"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3A425F" />
          <stop offset="1" stopColor="#29314F" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export interface UserAvatarProps {
  value: string;
  box?: boolean;
  size?: string;
}

export default function UserWalletAvatar({ value, box = true, size }: UserAvatarProps) {
  const classes = useStyles();

  return (
    <>
      {value && (
        <div className={classes.avatar}>
          <Jdenticon size={size} value={value} />
        </div>
      )}
      {box && (
        <div className={classes.avatarBg}>
          <AvatarBg />
        </div>
      )}
    </>
  );
}
