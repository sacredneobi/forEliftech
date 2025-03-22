import { Box } from "@mui/material";
import { forwardRef } from "react";

/**
 * @typedef {boolean | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'} AlignItems
 */

/**
 * @typedef {boolean | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'} JustifyContent
 */

/**
 * @typedef {Object} MyBoxProps
 * @property {boolean} [grow]
 * @property {boolean} [defFlex]
 * @property {boolean} [flex]
 * @property {boolean} [defGrid]
 * @property {boolean} [center]
 * @property {boolean} [row]
 * @property {boolean | number} [gap]
 * @property {boolean} [cross]
 * @property {string} [crossSize]
 * @property {boolean} [fullColor]
 * @property {boolean} [strong]
 * @property {boolean} [glass]
 * @property {boolean} [hover]
 * @property {boolean} [active]
 * @property {boolean} [wrap]
 * @property {string} [gridTemplateColumns]
 *
 * @property {AlignItems} [ai]
 * @property {JustifyContent} [jc]
 *
 */

/**
 * @typedef {import('@mui/material').BoxProps} MuiProps
 * @typedef {MuiProps & MyBoxProps} MyProps
 */

/**
 * @type {React.ForwardRefExoticComponent<MyProps & React.RefAttributes<HTMLElement>>}
 */

const Default = forwardRef((props, ref) => {
  const {
    flex,
    grid,
    ai,
    jc,
    center,
    row,
    gap,
    grow,
    sx,
    borderEmpty,
    border,
    hover,
    active,
    gridTemplateColumns,
    wrap,
    shadow,
    ...other
  } = props;

  let newSx = {};

  if (flex) {
    newSx.display = "flex";
    newSx.flexDirection = "column";
  }

  if (wrap) {
    newSx.flexWrap = wrap === true ? "wrap" : wrap;
  }

  if (grid) {
    newSx.display = "grid";
    newSx.gridTemplateColumns = "1fr 1fr";
    newSx.gap = 1;
  }

  if (gridTemplateColumns) {
    newSx.gridTemplateColumns = gridTemplateColumns;
  }

  if (ai) {
    newSx.alignItems = ai === true ? "center" : ai;
  }

  if (jc) {
    newSx.justifyContent = jc === true ? "center" : jc;
  }

  if (center) {
    newSx.alignItems = "center";
    newSx.justifyContent = "center";
  }

  if (row) {
    newSx.flexDirection = "row";
  }

  if (gap) {
    newSx.gap = gap === true ? 1 : parseFloat(gap) ? parseFloat(gap) : gap;
  }

  if (grow) {
    newSx.flexGrow =
      grow === true ? 1 : parseFloat(grow) ? parseFloat(grow) : grow;
  }

  if (hover) {
    newSx["&:hover"] = {
      backgroundColor: active ? "action.selected" : "action.hover",
    };
    newSx.transition = "background-color 200ms linear";
  }

  if (active) {
    newSx.backgroundColor = "action.selected";
    newSx.transition = "background-color 200ms linear";
  }

  if (border) {
    newSx.borderRadius = 2;
    newSx.border = ({ palette }) =>
      `${border === true ? 1 : border}px solid ${palette.divider}`;
  }

  if (shadow) {
    newSx.boxShadow = (theme) => theme.shadows[shadow === true ? 5 : shadow];
    newSx.borderRadius = 2;
  }

  return <Box ref={ref} sx={{ ...newSx, ...sx }} {...other} />;
});

export { Default as Box };
