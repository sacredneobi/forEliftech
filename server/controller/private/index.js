const path = require("path");
const { loaderModule } = require("@utils");

const { controllers, loaderFile } = loaderModule(
  __dirname,
  path.basename(__filename),
  "import_controller_private",
  (fileName) => require(`./${fileName}`)
);

console.done("SYSTEM", `Controllers PRIVATE: ${loaderFile.length}`);

process.controllers = { private: loaderFile };

module.exports = { path: "/api/private", controllers };
