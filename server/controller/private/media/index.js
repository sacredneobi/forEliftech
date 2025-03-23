const models = require("@models");
const { defAnswer, mediaMiddleware, mediaPath } = require("@utils");
const { literal, fn, col } = require("sequelize");

const model = models.questionRun;

const get = async (req, res) => {
  console.log(`${mediaPath}${req.query?.fileId}`);
  res.sendFile(`${mediaPath}${req.query?.fileId}`, {
    headers: {
      "Content-Type": "image/png", // Укажите нужный MIME-тип (image/jpeg, image/webp и т. д.)
    },
  });
};

const post = async (req, res) => {
  models.media
    .create(req.newFiles[0])
    .then((data) => {
      return { fileId: data?.fileId };
    })
    .defAnswer(res);
};

module.exports = (router) => {
  router.get("/", get);
  router.post("/", mediaMiddleware, post);

  return !!model;
};
