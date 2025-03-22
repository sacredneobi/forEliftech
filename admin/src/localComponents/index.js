import {
  createTheme,
  CssBaseline,
  Divider,
  Grow,
  ThemeProvider,
} from "@mui/material";
import dayjs from "dayjs";

const upperCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getPage = (component, name, props) => {
  return { component, name, pageName: `Page${upperCase(name)}`, ...props };
};

const requireAll = async (r) => {
  const obj = {};
  await Promise.all(
    r
      .keys()
      .filter((i) => i.split("/").length - 1 === 2)
      .map(async (path) => {
        const result = await r(path);

        Object.keys(result).forEach((i) => {
          if (i === "default") {
            const { pageName, ...other } = result.default;
            obj[pageName] = other;
          } else {
            const { pageName, ...other } = result[i];
            obj[i] = other;
          }
        });
      })
  );

  return obj;
};

const getHash = (def) => {
  const read = window.location.hash?.replace("#", "");

  if (read === "") {
    return [def];
  }

  const result = [read?.split(";")[0]];

  result.push(
    read
      ?.split(";")[1]
      ?.split(",")
      .reduce((prev, item) => {
        const data = item.split("=");
        prev[data[0]] = data[1];
        return prev;
      }, {})
  );

  return result;
};

const setHashValue = (value, data) =>
  (window.location.hash = `${value};${Object.keys(data ?? {})
    .reduce((p, i) => {
      p.push(`${i}=${data[i]}`);

      return p;
    }, [])
    .join(",")}`);

const defTheme = createTheme({
  palette: { mode: "dark" },
});

const theme = createTheme({
  palette: { mode: "dark" },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: 0,
          minWidth: 40,
          minHeight: 40,
          borderRadius: 8,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: `8px !important`,
          paddingRight: `6px !important`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          backgroundColor: "#1e2734",
          backgroundImage: "unset",
          boxShadow: defTheme.shadows[10],
          border: `1px solid ${defTheme.palette.divider}`,
        },
      },
    },
  },
});

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var uuid = (Math.random() * 16) | 0;
    return uuid.toString(16);
  });
}

const getNewObj = (data) => {
  if (!data) {
    return {};
  }
  return JSON.parse(JSON.stringify(data));
};

const getDuration = (time) => {
  let result = [];

  let done = false;

  result = dayjs
    .duration(time, "s")
    .format("HH_mm_ss")
    .split("_")
    .map((i) => {
      const result = !done && i === "00" ? null : i;

      if (result) {
        done = true;
      }

      return result;
    })
    .filter(Boolean);

  return result.join(":");
};

export * from "./api";
export * from "./box";
export * from "./event";
export * from "./text";
export * from "./icon";
export * from "./button";
export * from "./loading";
export * from "./dnd";
export * from "./input";
export * from "./select";
export * from "./checkbox";

export {
  CssBaseline,
  Divider,
  getHash,
  getPage,
  Grow,
  requireAll,
  setHashValue,
  theme,
  ThemeProvider,
  upperCase,
  uuid,
  getNewObj,
  getDuration,
};
