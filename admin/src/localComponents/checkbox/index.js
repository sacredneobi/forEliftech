import { Checkbox, FormControlLabel } from "@mui/material";

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
