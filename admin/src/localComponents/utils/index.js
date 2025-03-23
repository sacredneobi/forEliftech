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

export {
  getHash,
  getPage,
  requireAll,
  setHashValue,
  upperCase,
  uuid,
  getNewObj,
  getDuration,
};
