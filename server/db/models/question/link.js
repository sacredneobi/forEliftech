const { getBelongs } = require("../../../utils/db/belongs");
const { DataTypes, QueryTypes } = require("sequelize");

const columns = [
  { name: "options", type: DataTypes.JSONB },
  { name: "type", type: DataTypes.TEXT },
  { name: "correct", type: DataTypes.TEXT },
];

module.exports = (db, { defColumns, defOptions }, modelName) => {
  const { column } = defColumns(DataTypes, columns);

  const model = db.define(modelName, column, defOptions);

  model.associate = (models) => {
    getBelongs(model, models.question);
  };

  return model;
};
