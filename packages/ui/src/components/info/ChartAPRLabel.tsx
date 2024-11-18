import { useTheme } from "../Mui";

const LABEL_WIDTH = 82;

interface APRLabelProps {
  apr: string;
  viewBox: { x: number; y: number; width: number; height: number };
}

export function ChartAPRLabel(props: APRLabelProps) {
  const theme = useTheme();

  const wrapperHeight = 16;
  const wrapperY = props.viewBox.y - wrapperHeight / 2;
  const startX = 0;

  return (
    <>
      <defs>
        <path
          id="pool-apr-label"
          d={`M${startX} ${wrapperY + wrapperHeight / 2 + 1},${LABEL_WIDTH + startX},${
            wrapperY + wrapperHeight / 2 + 1
          }`}
          style={{
            stroke: "white",
            fill: "none",
          }}
        />
      </defs>

      <g width={LABEL_WIDTH} height={16}>
        <rect x={0} y={wrapperY} width={LABEL_WIDTH} height={16} fill={theme.colors.apr} rx="4" />
        <text
          fontSize="12px"
          fontWeight={500}
          fill={theme.colors.darkLevel1}
          style={{
            textAnchor: "middle",
            dominantBaseline: "middle",
          }}
        >
          <textPath xlinkHref="#pool-apr-label" startOffset="50%">
            Avg{props.apr}
          </textPath>
        </text>
      </g>
    </>
  );
}
