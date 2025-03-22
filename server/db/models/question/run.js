const { getBelongs } = require("../../../utils/db/belongs");
const { DataTypes } = require("sequelize");

const columns = [
  { name: "options", type: DataTypes.JSONB },
  { name: "time", type: DataTypes.INTEGER },
  { name: "done", type: DataTypes.BOOLEAN },
];

module.exports = (db, { defColumns, defOptions }, modelName) => {
  const { column } = defColumns(DataTypes, columns);

  const model = db.define(modelName, column, defOptions);

  model.associate = (models) => {
    getBelongs(model, models.question);
  };

  return model;
};
