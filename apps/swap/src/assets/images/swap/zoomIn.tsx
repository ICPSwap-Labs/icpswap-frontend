import { SvgIcon } from "components/Mui";

export default ({ fillColor = "#BDC8F0", ...props }) => {
  return (
    <SvgIcon viewBox="0 0 17 17" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.50033 12.6332C10.7831 12.6332 12.6337 10.7826 12.6337 8.49984C12.6337 6.21706 10.7831 4.3665 8.50033 4.3665C6.21755 4.3665 4.36699 6.21706 4.36699 8.49984C4.36699 10.7826 6.21755 12.6332 8.50033 12.6332ZM8.50033 13.8332C11.4458 13.8332 13.8337 11.4454 13.8337 8.49984C13.8337 5.55432 11.4458 3.1665 8.50033 3.1665C5.55481 3.1665 3.16699 5.55432 3.16699 8.49984C3.16699 11.4454 5.55481 13.8332 8.50033 13.8332Z"
        fill={fillColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.03295 5.8335H7.83295V7.83349H5.83301V9.03349H7.83295V11.1668H9.03295V9.03349H11.1663V7.83349H9.03295V5.8335Z"
        fill={fillColor}
      />
      <rect
        x="11.167"
        y="12.1094"
        width="1.33333"
        height="3.7233"
        transform="rotate(-45 11.167 12.1094)"
        fill={fillColor}
      />
    </SvgIcon>
  );
};
