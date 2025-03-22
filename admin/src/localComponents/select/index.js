import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const Default = (props) => {
  const { sx, caption, items, value, onChange } = props;

  const handleChange = (event) => {
    onChange?.(event.target.value);
  };

  return (
    <FormControl sx={sx} size="small">
      <InputLabel>{caption}</InputLabel>
      <Select value={value || ""} label={caption} onChange={handleChange}>
        {items?.map?.((i) => (
          <MenuItem key={i.id} value={i.id}>
            {i.caption}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export { Default as Select };
