import { useCallback } from "react";
import { useFetch } from "./useFetch";

const buildGet = (data) => {
  const items = Object.keys(data)
    .filter((item) => !!data[item] && item !== "reload")
    .map((item) => `${item ?? "error"}=${data[item] ?? "_"}`);

  if (items?.length > 0) {
    return `?${items.join("&")}`;
  }
  return "";
};

const useDef = (baseUrl, ...args) => {
  const { response, get, loading, abort } = useFetch(baseUrl, ...args);

  return [
    useCallback(
      (data, setData) => {
        if (data.history) {
          data.history = 1;
        }

        get(buildGet(data)).then((data) => {
          setData(response.ok ? data : null);
        });
      },
      [get, response]
    ),
    loading,
    abort,
  ];
};

export { useDef as defGetById };
