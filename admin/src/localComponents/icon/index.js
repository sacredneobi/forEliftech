import { Icon } from "@mui/material";

const icon = {
  action: "dots-vertical",
  run: "player-play",
  createNew: "plus",
  chart: "chart-area-line",
  back: "arrow-back-up",
  drag: "grip-vertical",
  delete: { icon: "trash", sx: { color: "warning.main" } },
  save: { icon: "device-floppy", sx: { color: "primary.main" } },
  cancel: { icon: "x", sx: { color: "warning.main" } },
  clear: "x",
  insert: "row-insert-bottom",
  edit: "pencil",
  sort: "arrows-sort",
  asc: "sort-ascending",
  desc: "sort-descending",
  video: "brand-youtube",
  select: "paperclip",
};

/**
 * @typedef {keyof icon} IconName
 */

/**
 * @typedef {Object} MyAddonProps
 * @property {IconName} [name]
 * @property {boolean} [disabled]
 *
 */

/**
 * @typedef {import('@mui/material').IconProps & MyAddonProps} MyProps
 */

/**
 * @param {MyProps} props
 * @returns {JSX.Element}
 */

const Default = (props) => {
  const { name, sx, disabled, ...other } = props;

  return (
    <Icon
      className={`ti ti-${icon[name]?.icon ?? icon[name]}`}
      sx={disabled ? sx : { ...icon[name]?.sx, ...sx }}
      {...other}
    />
  );
};

export { Default as Icon, icon };
