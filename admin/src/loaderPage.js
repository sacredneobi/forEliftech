import {
  addEvent,
  Box,
  requireAll,
  getHash,
  upperCase,
  Divider,
  Text,
} from "@localComponents";
import { useEffect, useState } from "react";

let pages = await requireAll(
  require.context("./pages", true, /index.js/, "lazy")
);

const buildPages = (role) => {
  const result = [];

  const push = (find, other) => {
    if (find) {
      result.push({ ...other, ...find });
    }
  };

  role?.forEach?.((item) => {
    const { routers, ...other } = item ?? {};

    if (routers?.length > 0) {
      routers.forEach((i) =>
        push(pages[i.page || `Page${upperCase(i.name)}`], other)
      );
    }

    push(pages[item.page || `Page${upperCase(item.name)}`], other);
  });

  return result;
};

const Pages = (props) => {
  const { page, main } = props;

  const [route, setRoute] = useState(getHash()[0]);

  useEffect(
    () =>
      addEvent("hashchange", () => setRoute(getHash()[0]), null, window, false),
    []
  );

  const uriParams = getHash()[1];

  const findPage = page.find(
    (item) => item.name === (route === "" || !route ? main : route)
  );

  const Render = findPage?.component;

  return Render ? (
    <Box flex grow gap shadow sx={{ p: 1 }}>
      <Render uriParams={uriParams} />
    </Box>
  ) : (
    <Box flex grow jc gap shadow sx={{ p: 4 }}>
      <Divider flex item>
        <Text caption="Page not found" marker />
      </Divider>
    </Box>
  );
};

const Default = (props) => {
  const { role } = props;
  const [page] = useState(buildPages(role));

  const findMain = "main";

  return (
    <Box
      name="page"
      flex
      grow
      sx={{
        overflow: "auto",
        p: 2,
        minHeight: "100dvh",
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <Pages page={page} main={findMain} />
    </Box>
  );
};

export { Default as LoaderPage };
