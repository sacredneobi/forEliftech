import { Checkbox, FormControlLabel } from "@mui/material";

/**
 * @typedef {Object} MyAddonProps
 * @property {string} [caption]
 * @property {boolean} [value]
 * @property {function} [onChange]
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
  const { caption, value, onChange } = props;

  const handleChange = (event) => {
    onChange?.(event.target.checked);
  };

  return (
    <FormControlLabel
      control={<Checkbox checked={value || false} onChange={handleChange} />}
      label={caption}
    />
  );
};

export { Default as Checkbox };
