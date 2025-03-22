const { getBelongs } = require("../../../utils/db/belongs");
const { DataTypes } = require("sequelize");

const columns = [
  { name: "fileId", type: DataTypes.TEXT, search: true },
  { name: "name", type: DataTypes.TEXT, search: true },
  { name: "size", type: DataTypes.INTEGER, search: true },
  { name: "mimeType", type: DataTypes.TEXT, search: true },
];

module.exports = (db, { defColumns, defOptions }, modelName) => {
  const { column } = defColumns(DataTypes, columns);

  const model = db.define(modelName, column, defOptions);

  model.associate = (models) => {
    getBelongs(model, models.question);
    getBelongs(model, models.questionLink);
    getBelongs(model, models.questionRun);
  };

  return model;
};
