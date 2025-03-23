import { useRef, useState } from "react";
import { Box } from "../box";
import { Button } from "../button";
import { Text } from "../text";
import { useMediaPost } from "@api";
import { Loading } from "../loading";

const arrFile = ["file"];

const Default = (props) => {
  const { onChange, value } = props;

  const [image, setImage] = useState(null);

  const [post, loading] = useMediaPost(arrFile);

  const ref = useRef();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    post({ file: { data: file } }, (data) => {
      if (data?.fileId) {
        onChange(data?.fileId);
      }
    });
    if (file) {
      setImage(URL.createObjectURL(file));
    }
    event.target.value = "";
  };

  const handleReset = () => {
    setImage(null);
    onChange(null);
  };

  return (
    <Box flex row gap ai>
      <Box grow />
      <input
        type="file"
        ref={ref}
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      {loading && <Loading size={40} />}

      {value && !image ? (
        <>
          <img
            src={`/api/private/media?fileId=${value}`}
            alt="Preview"
            style={{ width: 100, height: 100, objectFit: "contain" }}
          />
          <Button name="delete" onClick={handleReset} disabled={loading} />
        </>
      ) : image ? (
        <>
          <img
            src={image}
            alt="Preview"
            style={{ width: 100, height: 100, objectFit: "contain" }}
          />
          <Button name="delete" onClick={handleReset} disabled={loading} />
        </>
      ) : (
        <Box
          flex
          row
          ai
          gap
          onClick={() => {
            if (!loading) {
              ref.current?.click?.();
            }
          }}
          sx={{ cursor: "pointer" }}
        >
          <Text caption="Press to select image" disabled={loading} />
          <Button name="select" disabled={loading} />
        </Box>
      )}
    </Box>
  );
};

export { Default as File };
