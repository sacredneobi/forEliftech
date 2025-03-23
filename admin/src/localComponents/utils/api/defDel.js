import { useCallback } from "react";
import { useFetch } from "./useFetch";

const useDef = (baseUrl) => {
  const { response, del, loading, abort } = useFetch(baseUrl);

  return [
    useCallback(
      (data, setData) => {
        del(data).then((data) => {
          if (typeof setData === "function" && response.ok) {
            setData(data);
          }
        });
      },
      [del, response]
    ),
    loading,
    abort,
  ];
};

export { useDef as defDel };
