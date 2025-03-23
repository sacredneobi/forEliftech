import { Box, Text } from "@localComponents";
import { alpha, Divider, Stack } from "@mui/material";

const correct = {
  true: {
    bg: {
      backgroundColor: ({ palette }) => alpha(palette.success.main, 0.2),
    },
    color: {
      color: "success.main",
    },
    caption: "success",
  },
  false: {
    bg: {
      backgroundColor: ({ palette }) => alpha(palette.warning.main, 0.2),
    },
    color: {
      color: "warning.main",
    },
    caption: "mistake",
    showAnswer: true,
  },
  null: {
    bg: {},
  },
};

const Default = (props) => {
  const { answers } = props;

  return (
    <Box flex gap shadow={2} border grow sx={{ p: 1 }}>
      <Stack divider={<Divider sx={{ my: 1 }} />} direction="column">
        {answers?.map?.((item, index) => {
          if (!item) {
            return null;
          }

          const status = correct[String(item?.correct ?? null)];

          return (
            <Box
              key={index}
              flex
              gap
              sx={{ ...status.bg, p: 1, borderRadius: 2 }}
            >
              <Box flex row ai gap>
                <Text caption={index + 1} marker secondary />
                <Text caption={item.title} sx={{ flexGrow: 1 }} />
                <Text caption={status.caption} sx={status.color} />
              </Box>
              {Array.isArray(item.select) ? (
                item.select.map((i) => (
                  <Text key={i.id} caption={i.caption} sx={status.color} />
                ))
              ) : (
                <Text
                  caption={item?.select?.caption ?? item.value ?? ""}
                  sx={status.color}
                />
              )}
              {status.showAnswer &&
                item.answer?.map?.((i, index) => (
                  <Text
                    key={index}
                    caption={i.caption}
                    sx={{ color: "success.main" }}
                  />
                ))}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export { Default as Answers };
