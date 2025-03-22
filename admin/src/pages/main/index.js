import { useQuestionGetAll } from "@api";
import {
  addEvent,
  Box,
  Button,
  Divider,
  getPage,
  Loading,
  Text,
} from "@localComponents";
import { useEffect, useRef, useState } from "react";
import { Item } from "./item";
import { Sort } from "./menu";
import useInfiniteScroll from "beautiful-react-hooks/useInfiniteScroll";

const name = "main";

const Default = (props) => {
  const [get, loading] = useQuestionGetAll();
  const [items, setItems] = useState(null);
  const [page, setPage] = useState({ next: 0 });

  const ref = useRef();

  const onInfiniteScroll = useInfiniteScroll(ref);

  onInfiniteScroll(() => {
    setPage((p) => ({ next: p.next + 1 }));
  });

  useEffect(() => {
    const event = (detail) =>
      get({ ...detail, page: page?.next }, (data) => {
        if (detail) {
          setItems(data);
          setPage((p) => {
            p.next = 0;
            return p;
          });
        } else {
          setItems((p) => [...(p ?? []), ...(data ?? [])]);
          if (!(data?.length > 0)) {
            setPage((p) => {
              p.next = p.next - 1;
              return p;
            });
          }
        }
      });
    event();

    const arr = [
      addEvent("reload", () => event({})),
      addEvent("sort", (detail) => {
        event(detail);
      }),
    ];

    return () => arr.forEach((i) => i());
  }, [get, page]);

  return (
    <>
      <Divider flexItem>
        <Text caption="Quiz catalog" marker />
      </Divider>
      <Box flex row ai>
        <Button name="chart" caption="Show statistic" nav="showChart" />
        <Button
          name="video"
          caption="Got to video instruction"
          onClick={() => {
            window.open("https://youtu.be/LiBsjGPln98", "_blank");
          }}
        />
        <Box grow />
        <Sort />
        <Button name="createNew" caption="Add new quiz" nav="addQuiz" />
      </Box>
      <Box
        flex
        grow
        sx={{ overflow: "auto", height: 2, px: 1 }}
        className="hideScroll"
        ref={ref}
      >
        <Box
          flex
          grow
          center
          sx={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(4px)",
            display: loading ? "flex" : "none",
            zIndex: 10,
          }}
        >
          <Loading />
        </Box>
        <Box grid gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))">
          {items?.map?.((i) => (
            <Item key={i.id} {...i} />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default getPage(Default, name);
