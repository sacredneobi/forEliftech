const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const path = require("path");

const app = express();

app.set("trust proxy", true);
const log = typeof console.done === "function" ? console.done : console.log;

const clientPath = path.resolve(
  process.setting.client ?? path.join(__dirname, "./client")
);
const rootPath = path.resolve(
  (process.setting.client ?? path.join(__dirname, "./client")) + "/root"
);

const sendError = (err, res, fileName) => {
  if (err) {
    res.status(418).send({ file: `Not found ./${fileName}`, err });
  }
};

log("SYSTEM", clientPath);

morgan.token("platform", (req) => req.headers["x-platform"] || "");
morgan.token("client", (req) => req.headers["x-client"] || "");

app.use(
  morgan(
    ":remote-addr :method :platform :client -> :url :status :response-time ms :res[content-length] ",
    {
      stream: {
        write: (data) =>
          console.user(
            "HTTP",
            data?.trim()?.replaceAll("95.106.14.60", "ПАВЕЛ")
          ),
      },
    }
  )
);

app.use(express.json());
app.use(
  fileUpload({
    createParentPath: true,
    defParamCharset: "utf-8",
    limits: { fieldSize: 1048576 * 50 },
  })
);
app.use((req, res, next) => {
  res.setHeader("X-Server", process.setting.version);
  res.setHeader("X-Powered-By", "SACRED");
  next();
});

app.use((req, res, next) => {
  if (!req.url.includes("api")) {
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
      ...process.setting?.headers,
    });

    if (path.extname(req.url) !== "" && !req.url?.includes("?q=")) {
      res.sendFile(path.resolve(`${clientPath}${req.url}`), (err) => {
        sendError(err, res, req.url);
      });
    } else {
      if (String(req.url).startsWith("/root")) {
        res.sendFile(path.resolve(`${rootPath}/index.html`), (err) => {
          sendError(err, res, req.url);
        });
      } else {
        res.sendFile(path.resolve(`${clientPath}/index.html`), (err) => {
          sendError(err, res, req.url);
        });
      }
    }
    return;
  }
  next();
});

module.exports = { app };
