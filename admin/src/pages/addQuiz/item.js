import {
  addEvent,
  Box,
  Button,
  dispatch,
  Divider,
  Dnd,
  getNewObj,
  Input,
  Select,
  Text,
  uuid,
} from "@localComponents";
import { useCallback, useEffect, useState } from "react";
import { ItemOption } from "./itemOption";

const types = [
  { id: "text", caption: "Text" },
  { id: "single", caption: "Single select" },
  { id: "multi", caption: "Multi select" },
];

const Default = (props) => {
  const { item, index } = props;
  const [dataOld, setDataOld] = useState(getNewObj(item));
  const [data, setData] = useState(getNewObj(item));

  const id = item.id;
  const type = data?.type;

  const handleOnRender = useCallback(
    (item, _, isLast) => (
      <ItemOption item={item} isLast={isLast} id={id} type={type} />
    ),
    [id, type]
  );

  const disabledSave =
    JSON.stringify(dataOld) === JSON.stringify(data) ||
    data?.options?.some?.((i) => !i.caption);

  useEffect(() => {
    const arr = [
      addEvent(`deleteItemOption.${id}`, (detail) => {
        setData((p) => {
          p ??= {};
          p.options ??= [];

          p.options = p.options.filter((i) => i.id !== detail);
          return { ...p };
        });
      }),
      addEvent(`editItemOption.${id}`, (detail) => {
        setData((p) => {
          p ??= {};
          p.options ??= [];

          const findIndex = p.options.findIndex((i) => i.id === detail.id);

          if (findIndex >= 0) {
            p.options[findIndex] = detail;
          }

          return { ...p };
        });
      }),
      addEvent(`addItemOption.${id}`, (detail) => {
        setData((p) => {
          p ??= {};
          p.options ??= [];

          p.options.push({ id: uuid(), caption: "" });

          return { ...p };
        });
      }),
    ];

    return () => arr.forEach((i) => i());
  }, [id]);

  return (
    <Box flex gap grow>
      <Box flex row gap ai grow sx={{ py: 1 }}>
        <Text caption={index + 1} marker secondary />
        <Box flex row grow gap ai jc="flex-end" sx={{ flexWrap: "wrap" }}>
          <Input
            value={data?.caption}
            onChange={(value) => {
              setData((p) => {
                p ??= {};
                p.caption = value;
                return { ...p };
              });
            }}
            caption="Question"
          />
          <Select
            sx={{ minWidth: 100 }}
            caption="Type"
            value={data?.type}
            items={types}
            onChange={(value) => {
              if (value !== "multi") {
                dispatch(`checkSingleCorrect.${id}`);
              }

              setData((p) => {
                p ??= {};
                p.type = value;

                return { ...p };
              });
            }}
          />
        </Box>
        <Button
          name="save"
          disabled={disabledSave}
          onClick={() => {
            setDataOld(getNewObj(data));
            dispatch("editItem", data);
          }}
        />
        <Button
          name="delete"
          onClick={() => {
            dispatch("deleteItem", item.id);
          }}
        />
      </Box>
      {data.type !== "text" ? (
        <>
          <Divider>
            <Text caption="answers" marker secondary />
          </Divider>
          <Dnd
            items={data?.options ?? []}
            onRender={handleOnRender}
            emptyCaption={
              <Button
                name="insert"
                caption="Add answer"
                sxText={{ fontSize: 12 }}
                onClick={() => {
                  dispatch(`addItemOption.${id}`);
                }}
              />
            }
            onChange={(newSort) => {
              dispatch("editItem");
              setData((p) => {
                p ??= {};
                p.options = newSort;

                return { ...p };
              });
            }}
          />
        </>
      ) : (
        <Input
          value={data.correct}
          caption="Correct answer"
          onChange={(value) => {
            dispatch("editItem");
            setData((p) => {
              p ??= {};
              p.correct = value;

              return { ...p };
            });
          }}
        />
      )}
    </Box>
  );
};

export { Default as Item };
