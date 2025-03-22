import {
  addEvent,
  Box,
  Button,
  Checkbox,
  dispatch,
  getNewObj,
  Input,
} from "@localComponents";
import { useEffect, useState } from "react";

const Default = (props) => {
  const { item, isLast, id, type } = props;

  const [data, setData] = useState(getNewObj(item));
  const dataId = data?.id;

  useEffect(() => {
    dispatch(`editItemOption.${id}`, data);
  }, [data, id]);

  useEffect(() => {
    return addEvent(`checkSingleCorrect.${id}`, (detail) => {
      if (type !== "multi" || !detail) {
        if (detail !== dataId) {
          setData((p) => {
            p ??= {};

            p.correct = false;

            return { ...p };
          });
        }
      }
    });
  }, [dataId, id, type]);

  return (
    <Box flex row gap grow>
      <Input
        value={data?.caption}
        onChange={(value) => {
          setData((p) => {
            p.caption = value;
            return { ...p };
          });
        }}
        autoFocus
        sx={{ flexGrow: 1 }}
        caption="Question"
      />

      <Checkbox
        value={data?.correct}
        caption="Correct"
        onChange={(value) => {
          if (value) {
            dispatch(`checkSingleCorrect.${id}`, data.id);
          }

          setData((p) => {
            p.correct = value;

            return { ...p };
          });
        }}
      />
      <Button
        name="delete"
        onClick={() => {
          dispatch(`deleteItemOption.${id}`, item.id);
        }}
      />
      {isLast && (
        <Button
          name="createNew"
          sxText={{ fontSize: 12 }}
          onClick={() => {
            dispatch(`addItemOption.${id}`);
          }}
        />
      )}
    </Box>
  );
};

export { Default as ItemOption };
