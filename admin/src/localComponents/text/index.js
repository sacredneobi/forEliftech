import { Typography } from "@mui/material";
import { forwardRef } from "react";

/**
 * @typedef {Object} MyAddonProps
 * @property {string} [caption]
 * @property {string} [langBase]
 * @property {boolean} [secondary]
 * @property {boolean} [copy]
 * @property {boolean} [strong]
 * @property {boolean} [marker]
 * @property {boolean} [showEmpty]
 * @property {string} [help]
 * @property {object} [sxHelp]
 *
 */

/**
 * @typedef {import('@mui/material').TypographyProps} MuiProps
 * @typedef {MuiProps & MyAddonProps} MyProps
 */

/**
 * @type {React.ForwardRefExoticComponent<MyProps & React.RefAttributes<HTMLElement>>}
 */

const Default = forwardRef((props, ref) => {
  const {
    name,
    langBase: langBaseProps,
    caption,
    sx,
    secondary,
    strong,
    help,
    copy,
    copyButton,
    notFull,
    sxHelp,
    propsHelp,
    marker,
    showEmpty,
    setRef,
    ...other
  } = props;

  if ((!caption || caption === "") && !showEmpty) {
    return null;
  }

  let newSx = { lineHeight: "unset", fontSize: 18 };

  if (strong) {
    newSx.backgroundColor = "action.selected";
    newSx.px = 0.75;
    newSx.py = 0.25;
    newSx.borderRadius = 1;
  }

  if (marker) {
    newSx.backgroundColor = "unset";
    newSx.border = ({ palette }) => `1px solid ${palette.divider}`;
    newSx.px = 0.75;
    newSx.py = 0.25;
    newSx.borderRadius = 1;
  }

  if (secondary) {
    newSx.fontSize = 14;
    newSx.color = "text.secondary";
  }

  if (copy) {
    newSx.cursor = "pointer";
  }

  newSx = { ...newSx, ...sx };

  let component = (
    <Typography sx={newSx} ref={ref} {...other}>
      {caption}
    </Typography>
  );

  return component;
});

export { Default as Text };
