import {
  defDel,
  defGetAll,
  defGetById,
  defPost,
  defUpdate,
} from "@localComponents";

const baseUrl = `/api/private/question`;

const useGetAll = () => defGetAll(baseUrl);
const useGetById = () => defGetById(baseUrl);
const useUpdate = (withFile) => defUpdate(baseUrl, withFile, undefined, {});
const usePost = (withFile) => defPost(baseUrl, withFile, undefined, {});
const useDel = () => defDel(baseUrl);

export {
  useGetAll as useQuestionGetAll,
  useGetById as useQuestionGetById,
  useUpdate as useQuestionUpdate,
  usePost as useQuestionPost,
  useDel as useQuestionDel,
};
