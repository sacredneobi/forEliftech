const myArgs = process.argv.slice(2);
// if (myArgs.includes("debug")) {
//   process.stdout.write("\033c");

//   process.stdout.write("\u001b[0J\u001b[1J\u001b[2J\u001b[0;0H\u001b[0;0W");
// }

const moduleAlias = require("module-alias");
const EventEmitter = require("events");

process.mainEvent = new EventEmitter();

moduleAlias.addAlias("@utils", __dirname + "/../utils");
moduleAlias.addAlias("@models", __dirname + "/../db/models");

require("./setting");
require("./console");
require("./sequelize");
require("./promise");

module.exports = { ...require("./express") };

process.on("unhandledRejection", (reason, p) => {
  console.error("unhandledRejection", reason);
});
process.on("uncaughtException", (err) => {
  console.error("uncaughtException", err, "Uncaught Exception thrown");
});
