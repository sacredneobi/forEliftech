import { useQuestionGetById, useQuestionPost, useQuestionUpdate } from "@api";
import {
  addEvent,
  Box,
  Button,
  Divider,
  Dnd,
  getPage,
  Input,
  Loading,
  setHashValue,
  Text,
  uuid,
} from "@localComponents";
import { useCallback, useEffect, useState } from "react";
import { Item } from "./item";

const name = "addQuiz";

const arrFile = ["file"];

const Default = (props) => {
  const { uriParams } = props;
  const { id } = uriParams ?? {};

  const [get, loadingGet] = useQuestionGetById();
  const [post, loadingPost] = useQuestionPost(arrFile);
  const [update, loadingUpdate] = useQuestionUpdate(arrFile);
  const [items, setItems] = useState([]);
  const [data, setData] = useState({});
  const [needSave, setNeedSave] = useState(false);

  const loading = loadingGet || loadingPost || loadingUpdate;

  const handleOnRender = useCallback(
    (item, index) => <Item item={item} index={index} />,
    []
  );

  useEffect(() => {
    if (id) {
      get({ id }, (data) => {
        const { questionLinks, ...other } = data ?? {};
        setItems(questionLinks);
        setData(other);
      });
    }
  }, [get, id]);

  useEffect(() => {
    const arr = [
      addEvent("deleteItem", (detail) => {
        setNeedSave(true);
        setItems((p) => {
          p ??= [];

          p = p.filter((i) => i.id !== detail);
          return [...p];
        });
      }),
      addEvent("editItem", (detail) => {
        setNeedSave(true);
        setItems((p) => {
          p ??= [];

          const findIndex = p.findIndex((i) => i.id === detail?.id);

          if (findIndex >= 0) {
            p[findIndex] = detail;
          }

          return [...p];
        });
      }),
      addEvent("addItem", () => {
        setNeedSave(true);
        setItems((p) => {
          p ??= [];

          p.push({ id: uuid(), caption: "" });

          return [...p];
        });
      }),
    ];

    return () => arr.forEach((i) => i());
  });

  const newItem = (
    <Button
      name="createNew"
      caption="Add question"
      onClick={() => {
        setNeedSave(true);
        setItems((p) => {
          p.push({ id: uuid(), caption: "", options: [], type: "text" });
          return [...p];
        });
      }}
    />
  );

  if (loading) {
    return (
      <Box flex grow center>
        <Loading />
      </Box>
    );
  }

  const disabledSave =
    !needSave || items?.length === 0 || items?.some?.((i) => !i.caption);

  return (
    <>
      <Divider flexItem>
        <Text caption={`Quiz ${id ? "edit" : "create"}`} marker />
      </Divider>
      <Box flex row ai jc="space-between">
        <Button name="back" />
        {items?.length > 0 && newItem}
      </Box>
      <Box flex gap>
        <Input
          caption="Caption quiz"
          value={data?.caption}
          onChange={(value) => {
            setNeedSave(true);
            setData((p) => {
              p ??= {};
              p.caption = value;
              return { ...p };
            });
          }}
        />
        <Input
          caption="Description quiz"
          value={data?.description}
          onChange={(value) => {
            setNeedSave(true);
            setData((p) => {
              p ??= {};
              p.description = value;
              return { ...p };
            });
          }}
        />
      </Box>
      <Divider flexItem />
      <Box
        flex
        grow
        sx={{ overflow: "auto", height: 2, px: 1 }}
        className="hideScroll"
      >
        <Dnd
          items={items}
          emptyCaption={
            <Box flex center>
              <Text caption="Empty list questions" />
              {newItem}
            </Box>
          }
          onChange={(newOrder) => {
            if (Array.isArray(newOrder)) {
              setNeedSave(true);
              setItems([...newOrder]);
            }
          }}
          onRender={handleOnRender}
        />
      </Box>
      <Divider flexItem />
      <Box flex row gap jc ai>
        <Button
          name="cancel"
          caption="Cancel"
          disabled={!needSave || !(items?.length > 0)}
          color="warning"
          onClick={() => {
            setHashValue("");
          }}
        />
        <Divider flexItem orientation="vertical" sx={{ my: 1 }} />
        <Button
          name="save"
          caption="Save"
          disabled={disabledSave}
          onClick={() => {
            const event = () => {
              setNeedSave(false);
              setHashValue("");
            };

            (id ? update : post)({ ...data, options: items }, event);
          }}
        />
      </Box>
    </>
  );
};

export default getPage(Default, name);
