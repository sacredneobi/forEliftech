import {
  defDel,
  defGetAll,
  defGetById,
  defPost,
  defUpdate,
} from "@localComponents";

const baseUrl = `/api/private/questionRun`;

const useGetAll = () => defGetAll(baseUrl);
const useGetById = () => defGetById(baseUrl);
const useUpdate = (withFile) => defUpdate(baseUrl, withFile, undefined, {});
const usePost = (withFile) => defPost(baseUrl, withFile, undefined, {});
const useDel = () => defDel(baseUrl);

export {
  useGetAll as useQuestionRunGetAll,
  useGetById as useQuestionRunGetById,
  useUpdate as useQuestionRunUpdate,
  usePost as useQuestionRunPost,
  useDel as useQuestionRunDel,
};
