import { useCallback } from "react";
import { useFetch } from "./useFetch";
import { createMultiPart } from "./multiPart";

const useDef = (baseUrl, withFile, ...args) => {
  const { response, put, loading, abort } = useFetch(baseUrl, ...args);

  return [
    useCallback(
      (data, setData) => {
        let newData = data;
        if (Array.isArray(withFile)) {
          newData = createMultiPart(data, withFile);
        }

        put(newData).then((data) => {
          if (typeof setData === "function" && response.ok) {
            setData(data);
          }
        });
      },
      [put, response, withFile]
    ),
    loading,
    abort,
  ];
};

export { useDef as defUpdate };
