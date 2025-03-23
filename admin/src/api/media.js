import {
  defDel,
  defGetAll,
  defGetById,
  defPost,
  defUpdate,
} from "@localComponents";

const baseUrl = `/api/private/media`;

const useGetAll = () => defGetAll(baseUrl);
const useGetById = () => defGetById(baseUrl);
const useUpdate = (withFile) => defUpdate(baseUrl, withFile, undefined, {});
const usePost = (withFile) => defPost(baseUrl, withFile, undefined, {});
const useDel = () => defDel(baseUrl);

export {
  useGetAll as useMediaGetAll,
  useGetById as useMediaGetById,
  useUpdate as useMediaUpdate,
  usePost as useMediaPost,
  useDel as useMediaDel,
};
