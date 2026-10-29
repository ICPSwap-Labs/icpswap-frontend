import Logo from "components/Logo";
import { ButtonBase } from "components/Mui";
import { useDesignVersion } from "hooks/useDesignVersion";
import { Link } from "react-router-dom";

export default function LogoSection({ iconOnly = false }: { iconOnly?: boolean }) {
  const { isClassicDesign } = useDesignVersion();
  return (
    <ButtonBase
      disableRipple
      component={Link}
      to="/"
      aria-label="ICPSwap"
      sx={{
        flexShrink: 0,
        ...(iconOnly ? { width: "32px", height: "32px" } : {}),
        borderRadius: "8px",
        "& img": {
          width: isClassicDesign ? "100px" : "125px",
          height: "32px",
          objectFit: "contain",
          ...(iconOnly ? { maxWidth: "none" } : {}),
        },
        "&:focus-visible": { outline: "2px solid var(--color-primary)", outlineOffset: "6px" },
        "@media(max-width: 640px)": { "& img": { width: isClassicDesign ? "100px" : "106px" } },
      }}
    >
      {iconOnly ? (
        <span className="block h-8 w-8 shrink-0 overflow-hidden">
          <Logo />
        </span>
      ) : (
        <Logo />
      )}
    </ButtonBase>
  );
}
