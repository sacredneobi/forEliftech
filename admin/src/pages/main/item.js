import { Box, Button, Text } from "@localComponents";
import { Menu } from "./menu";

const Default = (props) => {
  const { caption, description, countData, countDone, id } = props;

  return (
    <Box flex gap shadow={2} border sx={{ p: 1.5, minHeight: 150 }}>
      <Box ai flex row jc="space-between">
        <Text caption={caption} marker showEmpty />
        <Menu id={id} />
      </Box>
      <Box flex gap sx={{ alignSelf: "flex-start" }}>
        <Text caption={description} secondary />
      </Box>
      <Box grow />
      <Box ai="flex-end" flex row jc="space-between">
        <Box flex row gap ai>
          {countData > 0 ? (
            <Text caption={`Questions: ${countData}`} secondary />
          ) : (
            <div />
          )}
          {countDone > 0 ? (
            <Text caption={`Completions: ${countDone}`} secondary />
          ) : (
            <div />
          )}
        </Box>
        <Button name="run" nav="run" propsNav={{ id }} />
      </Box>
    </Box>
  );
};

export { Default as Item };
