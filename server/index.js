const { defAnswerError } = require("./utils/express/defAnswer");
const { app } = require("./config");
const models = require("./db/models");
const setupDB = require("./db/setup");

const myArgs = process.argv.slice(2);

if (myArgs.includes("service")) {
  const service = require("./service");
  service();
} else {
  const init = () => {
    require("./controller")(app);

    app.use((err, req, res, next) => {
      defAnswerError(res)(err);
    });

    app.listen(process.setting.port, () => {
      console.user(["Run", "port"], process.setting.port);
    });
  };

  setupDB(models).then(init);
}
