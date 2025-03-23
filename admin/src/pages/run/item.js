import { Box, Checkbox, Divider, File, Input, Text } from "@localComponents";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

const Default = (props) => {
  const { item, option, setOption } = props;

  console.log(item);

  return (
    <Box flex gap shadow={2} border grow sx={{ p: 2 }}>
      <Text caption={item.caption} />
      <Divider />
      {item.type === "text" && (
        <Input
          caption="Answer"
          value={option?.value}
          onChange={(value) => {
            setOption((p) => {
              p.value = value;
              p.title = item.caption;
              p.id = item.id;

              return { ...p };
            });
          }}
        />
      )}
      {item.type === "multi" && (
        <Box flex gap>
          {item?.options?.map?.((i) => (
            <Box key={i.id}>
              <Checkbox
                caption={i.caption}
                value={option[i.id]}
                onChange={(value) => {
                  setOption((p) => {
                    if (!value) {
                      delete p[i.id];
                    } else {
                      p[i.id] = value;
                    }

                    const allSelect = Object.keys(p).filter((i) => !!p[i]);

                    p.select = item?.options?.filter?.((i) =>
                      allSelect.includes(i.id)
                    );
                    p.title = item.caption;
                    p.id = item.id;

                    return { ...p };
                  });
                }}
              />
            </Box>
          ))}
        </Box>
      )}
      {item.type === "single" && (
        <Box flex gap>
          <RadioGroup
            value={option.value ?? null}
            onChange={(e) => {
              setOption((p) => {
                p.value = e.target.value;
                p.select = item?.options?.find((i) => i.id === p.value);
                p.title = item.caption;
                p.id = item.id;

                return { ...p };
              });
            }}
          >
            {item?.options?.map?.((i) => (
              <FormControlLabel
                key={i.id}
                value={i.id}
                control={<Radio />}
                label={i.caption}
              />
            ))}
          </RadioGroup>
        </Box>
      )}
      {item.type === "image" && (
        <Box flex gap ai>
          {item.options?.map?.((i) => (
            <img
              key={i.image}
              src={`/api/private/media?fileId=${i.image}`}
              alt="question_image"
              style={{ maxWidth: "50%" }}
            />
          ))}
          <Divider sx={{ width: 1 }}>
            <Text caption="Send your answer" marker secondary />
          </Divider>
          <File
            onChange={(value) => {
              setOption((p) => {
                p.value = value;
                p.select = item?.options;
                p.title = item.caption;
                p.id = item.id;

                return { ...p };
              });
            }}
          />
        </Box>
      )}
      <Box grow />
    </Box>
  );
};

export { Default as Item };
