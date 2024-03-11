export interface RefreshIconProps {
  fill?: string;
}

export function RefreshIcon({ fill = "write" }: RefreshIconProps) {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.0013 3.33268V0.666016L2.66797 3.99935L6.0013 7.33268V4.66602C8.20797 4.66602 10.0013 6.45935 10.0013 8.66602C10.0013 10.8727 8.20797 12.666 6.0013 12.666C3.79464 12.666 2.0013 10.8727 2.0013 8.66602H0.667969C0.667969 11.6127 3.05464 13.9993 6.0013 13.9993C8.94797 13.9993 11.3346 11.6127 11.3346 8.66602C11.3346 5.71935 8.94797 3.33268 6.0013 3.33268Z"
        fill={fill}
      />
    </svg>
  );
}
