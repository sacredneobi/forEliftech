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

const useDef = (baseUrl, full, ...args) => {
  const { response, get, loading, abort } = useFetch(baseUrl, ...args);

  return [
    useCallback(
      (data, setData, def) => {
        get(buildGet({ ...data, short: true })).then((data) => {
          if (full) {
            setData(response.ok ? data : def ?? null);
          } else {
            setData(response.ok ? data?.rows ?? data : def ?? null);
          }
        });
      },
      [get, response, full]
    ),
    loading,
    abort,
  ];
};

export { useDef as defGetAll };
