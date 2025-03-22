import { TextField } from "@mui/material";
import { Button } from "../button";
import { Box } from "../box";

const Default = (props) => {
  const { onChange, caption, value, ...other } = props;

  return (
    <TextField
      value={value || ""}
      size="small"
      onChange={(e) => {
        onChange?.(e.target.value);
      }}
      sx={{ flexGrow: 1 }}
      label={caption}
      {...other}
      helperText={!value && "Need fill"}
      error={!value}
      slotProps={{
        input: {
          endAdornment: value ? (
            <Box flex center>
              <Button
                name="clear"
                onClick={() => onChange?.("")}
                sx={{ minWidth: 30, minHeight: 30, p: 0 }}
                sxIcon={{ fontSize: 16 }}
              />
            </Box>
          ) : null,
        },
      }}
    />
  );
};

export { Default as Input };
