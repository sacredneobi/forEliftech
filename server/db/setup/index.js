const Umzug = require("umzug");
const checkAndCreateDB = require("./checkAndCreateDB");
const path = require("path");
const { loaderModule } = require("@utils");

const log = typeof console.done === "function" ? console.done : console.log;

const logEvent = (eventName, isBegin) => (name) => {
  log(eventName.toUpperCase(), name);
};

function setupMigration(options) {
  const { sequelize, path: pathProps } = options;

  let listModule = [];

  loaderModule(pathProps, pathProps, "import_migration", (fileName) => {
    const model = require(`../migrations/${fileName}`);
    listModule.push({ name: fileName, ...model });
  });

  listModule = listModule.sort((a, b) => a.name.localeCompare(b.name));

  const processMigration = new Umzug({
    storage: "sequelize",
    storageOptions: { sequelize },
    migrations: Umzug.migrationsList(listModule, [
      sequelize.getQueryInterface(),
      sequelize.constructor,
      () => {
        throw new Error(
          'Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.'
        );
      },
    ]),
    logging: () => {},
  });

  processMigration.on("migrating", logEvent("migrating", true));
  processMigration.on("migrated", logEvent("migrated"));
  processMigration.on("reverting", logEvent("reverting"));
  processMigration.on("reverted", logEvent("reverted"));

  return processMigration;
}

const getStatus = async (processMigration) => {
  const pending = (await processMigration.pending()).map((item) => item.file);

  const status = {
    new: pending.length,
  };

  if (pending.length > 0) {
    log(["DB", "NEW MIGRATION"], status?.new);
  } else {
    log("DB", "ACTUAL");
  }
  return pending.length;
};

const setupDB = async (models) => {
  log("DB", "CONNECT");
  await checkAndCreateDB(process.setting);
  const processMigration = setupMigration({
    sequelize: models.sequelize,
    path: path.resolve(__dirname + "/../migrations"),
  });

  await getStatus(processMigration);

  await processMigration.up();
};

module.exports = setupDB;
