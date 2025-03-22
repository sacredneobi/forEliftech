const fs = require("fs");
const main = require("./version.json");

process.setting = {
  db: {
    username: "postgres",
    password: "postgres",
    database: "order_2",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  jwt: "mySecretJWT",
  port: 4002,
  ...main,
  version: main.version,
};

try {
  const data = fs.readFileSync("./setting.json");
  if (data) {
    const loadData = JSON.parse(data);
    process.setting = {
      ...process.setting,
      ...loadData,
      db: { ...process.setting?.db, ...loadData?.db },
    };
  }
} catch (err) {
  console.error("SETTING", err);
}

module.exports = process.setting.db;
