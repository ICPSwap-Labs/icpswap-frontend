import styled from "styled-components";
import { Box } from "rebass/styled-components";
import { Box as MuiBox } from "@mui/material";

const Row = styled(Box)<{
  width?: string;
  align?: string;
  justify?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
}>`
  width: ${({ width }) => width ?? "100%"};
  display: flex;
  padding: 0;
  align-items: ${({ align }) => align ?? "center"};
  justify-content: ${({ justify }) => justify ?? "flex-start"};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`;

export interface RowBetweenProps {
  children: React.ReactNode;
  alignItems?: string;
}

export function RowBetween({ children, alignItems }: RowBetweenProps) {
  return (
    <MuiBox
      sx={{
        display: "flex",
        width: "100%",
        padding: "0",
        justifyContent: "space-between",
        alignItems: alignItems ?? "center",
      }}
    >
      {children}
    </MuiBox>
  );
}

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const AutoRow = styled(Row)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;

export const RowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};
`;

export default Row;
