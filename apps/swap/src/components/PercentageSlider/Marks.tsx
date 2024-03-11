import { Slider, Tooltip, tooltipClasses } from "@mui/material";
import { styled, makeStyles } from "@mui/styles";
import { isDarkTheme } from "utils";
import { Theme } from "@mui/material/styles";

const useStyle = makeStyles((theme: Theme) => {
  return {
    root: {
      color: theme.colors.secondaryMain,
      "& .MuiSlider-rail": {
        height: "4px",
        backgroundColor: isDarkTheme(theme) ? theme.palette.background.level4 : "#fff",
      },
      "& .MuiSlider-thumb": {
        width: "16px",
        height: "16px",
        border: "2px solid #fff",
        marginLeft: "5px",
      },
      "& .MuiSlider-mark": {
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: theme.palette.background.level4,
        top: "50%",
        transform: "translate(0, -50%)",
        opacity: 1,
        "&.MuiSlider-markActive": {
          backgroundColor: theme.colors.secondaryMain,
        },
      },
    },
    tooltip: {},
  };
});

const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }: { theme: Theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.colors.secondaryMain,
      color: "#fff",
      fontWeight: 700,
    },
    "& .MuiTooltip-arrow": {
      color: theme.colors.secondaryMain,
    },
  }),
);

const ValueLabelComponent = (props: any) => {
  const { children, value } = props;
  const classes = useStyle();

  return (
    <LightTooltip placement="top" arrow title={`${value}%`} className={classes.tooltip}>
      {children}
    </LightTooltip>
  );
};

export type SliderMark = {
  value: number;
};

export interface SliderProps {
  marks?: SliderMark[];
  [x: string]: any;
}

export default function PercentageSlider({
  marks = [{ value: 0 }, { value: 25 }, { value: 50 }, { value: 75 }, { value: 100 }],
  ...props
}: SliderProps) {
  const classes = useStyle();

  return (
    <Slider
      {...props}
      className={classes.root}
      marks={marks}
      valueLabelDisplay="auto"
      components={{
        ValueLabel: ValueLabelComponent,
      }}
    />
  );
}
