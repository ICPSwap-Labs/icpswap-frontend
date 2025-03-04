import { Link } from "react-router-dom";
import { ButtonBase } from "components/Mui";
import Logo from "components/Logo";

export default function LogoSection() {
  return (
    <ButtonBase disableRipple component={Link} to="/">
      <Logo />
    </ButtonBase>
  );
}
