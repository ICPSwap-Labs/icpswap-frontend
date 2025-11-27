import { Slider, Tooltip, tooltipClasses, SliderProps, Theme, styled, makeStyles } from "components/Mui";

const marks = [{ value: 0 }, { value: 25 }, { value: 50 }, { value: 75 }, { value: 100 }];

const useStyle = makeStyles((theme: Theme) => {
  return {
    root: {
      color: "#54C081",
      padding: "8px 0",
      "& .MuiSlider-rail": {
        height: "4px",
        backgroundColor: "#4F5A84",
      },
      "& .MuiSlider-thumb": {
        width: "16px",
        height: "16px",
        border: "2px solid #8492C4",
        marginLeft: "5px",
        color: "#111936",
        "&:hover": {
          boxShadow: "none",
        },
        "&.Mui-focusVisible": {
          boxShadow: "none",
        },
      },
      "& .MuiSlider-mark": {
        width: "2px",
        height: "8px",
        backgroundColor: theme.palette.background.level4,
        top: "50%",
        transform: "translate(0, -50%)",
        opacity: 1,
        "&.MuiSlider-markActive": {
          backgroundColor: theme.palette.background.level4,
        },
      },
      "& .MuiSlider-mark[data-index='0']": {
        display: "none",
      },
    },
    tooltip: {},
  };
});

const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  () => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#ffffff",
      color: "#000",
      fontWeight: 500,
      fontSize: "12px",
    },
    "& .MuiTooltip-arrow": {
      color: "#ffffff",
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

export function MuiSlider(props: SliderProps) {
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
