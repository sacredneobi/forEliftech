import {
  defDel,
  defGetAll,
  defGetById,
  defPost,
  defUpdate,
} from "@localComponents";

const baseUrl = `/api/private/stats`;

const useGetAll = () => defGetAll(baseUrl);
const useGetById = () => defGetById(baseUrl);
const useUpdate = (withFile) => defUpdate(baseUrl, withFile, undefined, {});
const usePost = (withFile) => defPost(baseUrl, withFile, undefined, {});
const useDel = () => defDel(baseUrl);

export {
  useGetAll as useStatsGetAll,
  useGetById as useStatsGetById,
  useUpdate as useStatsUpdate,
  usePost as useStatsPost,
  useDel as useStatsDel,
};
