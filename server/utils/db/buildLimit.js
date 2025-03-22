const buildLimit = (limit, offset, exclude, include) => {
  const result = {};
  if (parseInt(limit)) {
    result.limit = parseInt(limit);
  }
  if (parseInt(offset)) {
    result.offset = parseInt(offset);
  }
  result.attributes = {
    exclude: ["createdAt", "updatedAt", "deletedAt", ...(exclude ?? [])],
    include,
  };
  return result;
};

module.exports = { buildLimit };
