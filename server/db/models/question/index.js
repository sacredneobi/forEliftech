const { DataTypes } = require("sequelize");

const columns = [
  { name: "options", type: DataTypes.JSONB },
  { name: "type", type: DataTypes.STRING },
  { name: "countRun", type: DataTypes.INTEGER },
  { name: "countDone", type: DataTypes.INTEGER },
];

module.exports = (db, { defColumns, defOptions }, modelName) => {
  const { column } = defColumns(DataTypes, columns, [
    { name: "countData", type: "count" },
  ]);

  const model = db.define(modelName, column, defOptions);

  model.associate = (models) => {};

  return model;
};
