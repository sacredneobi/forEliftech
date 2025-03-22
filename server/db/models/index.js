const path = require("path");
const Sequelize = require("sequelize");
const pg = require("pg");
const { loaderModule } = require("../../utils/file/loader");
const Model = require("sequelize/lib/model");
require("../../config/setting");

const db = {};

let sequelize = process.setting?.db
  ? new Sequelize(
      process.setting.db.database,
      process.setting.db.username,
      process.setting.db.password,
      {
        ...process.setting.db,
        dialectModule: pg,
        logging: null,
        dialectOptions: {
          useUTC: true,
          timezone: "Etc/GMT0",
        },
        timezone: "Etc/GMT0",
      }
    )
  : null;

const loaderFile = [];
const defOptions = {
  paranoid: true,
};

const defColumns = (DataTypes, columns, virtual) => {
  if (!columns.find((i) => i.name === "caption")) {
    columns.push({
      name: "caption",
      type: DataTypes.TEXT,
    });
  }
  if (!columns.find((i) => i.name === "description")) {
    columns.push({
      name: "description",
      type: DataTypes.TEXT,
    });
  }

  const column = columns.reduce((prev, item) => {
    prev[item.name] = item.type ?? item.obj;
    return prev;
  }, {});

  if (Array.isArray(virtual)) {
    virtual.forEach((i) => {
      if (i.type === "count") {
        column[i.name] = {
          type: DataTypes.VIRTUAL,
          get() {
            const rawValue = this.getDataValue(i.name);
            return isNaN(parseInt(rawValue)) ? null : parseInt(rawValue);
          },
        };
      }
    });
  }

  return {
    column: {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      ...column,
    },
  };
};

loaderModule(
  __dirname,
  path.basename(__filename),
  "import_model",
  (fileName) => require(`./${fileName}`),
  false,
  (model, modelName) => {
    if (typeof model === "function") {
      const loadModel = model(sequelize, { defColumns, defOptions }, modelName);

      if (loadModel) {
        if (loaderFile.includes(modelName)) {
          throw new Error(`Error, module exist! ${modelName}`);
        }
        loaderFile.push(modelName);
        db[loadModel.name] = loadModel;
      }
    }
  }
);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

db.selectQuery = (model, ...args) => {
  const options = args[0];

  if (options.include) {
    Model._validateIncludedElements.bind(model)(options);
  }
  Model._paranoidClause(model, options);

  model._injectScope(args);

  return `(${sequelize.dialect.queryGenerator
    .selectQuery(model.getTableName(), ...args)
    ?.slice(0, -1)})`;
};

module.exports = { ...db };
