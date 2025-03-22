const fs = require("fs");
const path = require("path");

const mediaPath = path.resolve(`./media/`) + path.sep;

if (!fs.existsSync(mediaPath)) {
  fs.mkdirSync(mediaPath);
}

module.exports = {
  ...require("./loader"),
};
