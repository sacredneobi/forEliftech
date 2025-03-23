import { Button } from "@mui/material";
import { Icon } from "../icon";
import { Text } from "../text";
import { setHashValue } from "@localComponents";

/**
 * @typedef {Object} MyAddonProps
 * @property {string} [caption]
 * @property {keyof import('../icon').IconName} [name]
 * @property {string} [nav]
 * @property {object} [propsNav]
 * @property {SxProps<Theme>} [sxText]
 * @property {SxProps<Theme>} [sxIcon]
 *
 */

/**
 * @typedef {import('@mui/material').CheckboxProps & MyAddonProps} MyProps
 */

/**
 * @param {MyProps} props
 * @returns {JSX.Element}
 */

const Default = (props) => {
  const { name, caption, sx, nav, propsNav, sxText, sxIcon, ...other } = props;

  return (
    <Button
      variant="text"
      sx={{ px: caption ? 1 : null, alignItems: "center", gap: 1, ...sx }}
      onClick={
        nav || name === "back"
          ? () => {
              if (name === "back") {
                setHashValue("");
              } else {
                setHashValue(nav, propsNav);
              }
            }
          : null
      }
      {...other}
    >
      {!!name && (
        <Icon
          name={name}
          sx={{ mb: caption ? 0.25 : null, ...sxIcon }}
          disabled={other?.disabled}
        />
      )}
      {!!caption && <Text caption={caption} sx={sxText} />}
    </Button>
  );
};

export { Default as Button };
