const createMultiPart = (data, arrFile = []) => {
  // console.log(data, arrFile);

  const result = new FormData();

  const newData = Object.keys(data ?? {}).reduce((prev, item) => {
    if (arrFile.includes(item)) {
      let done = false;
      // console.log(item, data[item]);
      if (data[item]?.data instanceof File) {
        result.append(
          `${data[item].caption}${data[item]?.id ? `/${data[item]?.id}` : ""}`,
          data[item]?.data
        );
        done = true;
      }
      if (Array.isArray(data[item])) {
        data[item].forEach((item) => {
          if (item.data instanceof File) {
            result.append(
              `${item.caption}${item?.id ? `/${item?.id}` : ""}`,
              item.data
            );
            done = true;
          }
        });
      }

      if (!done) {
        const blob = new Blob([JSON.stringify(data[item])], {
          type: "text/plain",
        });
        const fileData = new File([blob], item, {
          type: "text/plain",
        });

        result.append(item, fileData);
      }
      // if ()
    } else {
      if (data[item]?.preview) {
        result.append(data[item].caption, data[item]?.data);
      } else {
        prev[item] = data[item];
      }
    }

    return prev;
  }, {});

  result.append("data", JSON.stringify(newData));

  return result;
};

export { createMultiPart };
