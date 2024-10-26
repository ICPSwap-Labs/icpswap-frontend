import { Slider, Tooltip, tooltipClasses, SliderProps } from "@mui/material";
import { styled, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

const marks = [{ value: 0 }, { value: 25 }, { value: 50 }, { value: 75 }, { value: 100 }];

const useStyle = makeStyles((theme: Theme) => {
  return {
    root: {
      color: theme.colors.secondaryMain,
      "& .MuiSlider-rail": {
        height: "4px",
        backgroundColor: theme.palette.background.level4,
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

const ValueLabelComponent = (props: { children: React.ReactChild; value: string | number }) => {
  const { children, value } = props;
  const classes = useStyle();

  return (
    <LightTooltip placement="top" arrow title={`${value}%`} className={classes.tooltip}>
      {children}
    </LightTooltip>
  );
};

export interface ProgressionProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

export function Progression({ value, onChange }: ProgressionProps) {
  const classes = useStyle();

  const handleSliderChange = (event, value: number | number[]) => {
    if (typeof value === "number") {
      onChange(value);
    } else {
      onChange(value[0]);
    }
  };

  return (
    <Slider
      value={value}
      className={classes.root}
      marks={marks}
      valueLabelDisplay="auto"
      components={{
        ValueLabel: ValueLabelComponent,
      }}
      onChange={handleSliderChange}
    />
  );
}
