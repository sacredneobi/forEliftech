import { useCallback } from "react";
import { useFetch } from "./useFetch";
import { createMultiPart } from "./multiPart";

const useDef = (baseUrl, withFile, ...args) => {
  const { response, post, loading, abort } = useFetch(baseUrl, ...args);

  return [
    useCallback(
      (data, setData, emptyAnswer) => {
        let newData = data;
        if (Array.isArray(withFile)) {
          newData = createMultiPart(data, withFile);
        }

        post(newData).then((data) => {
          if (response.ok) {
            setData?.(data);
          } else {
            if (emptyAnswer) {
              setData?.(data);
            }
          }
        });
      },
      [post, response, withFile]
    ),
    loading,
    abort,
  ];
};

export { useDef as defPost };
