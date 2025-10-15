import QRCode from "qrcode.react";

export interface QRCodeProps {
  width?: number;
  height?: number;
  value: string;
  size?: number;
}

export default ({ value, ...props }: QRCodeProps) => {
  return <QRCode value={value} {...props} />;
};
