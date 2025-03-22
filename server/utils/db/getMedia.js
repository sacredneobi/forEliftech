const { Op, HasMany } = require("sequelize");
const { media } = require("@models");
const { defExclude } = require("./defExclude");

const attr = ["id", "fileId", "name", "size", "mimeType"];

const getMedia = (model, short, as) => {
  if (!model) {
    return {};
  }
  return {
    association: new HasMany(model, media, {
      sourceKey: "id",
      foreignKey: `${as ?? model.name}Id`,
    }),
    attributes: short ? ["fileId"] : [...attr, `${as ?? model.name}Id`],
  };
};

module.exports = { getMedia };
