const models = require("@models");
const {
  checkVal,
  defExclude,
  buildLimit,
  defDelete,
  mediaMiddleware,
  getFieldCount,
} = require("@utils");
const { Op } = require("sequelize");
const { HasMany } = require("sequelize");

const model = models.question;

const orderBy = {
  name: "caption",
  questions: "countData",
  completions: "countDone",
};

const get = async (req, res) => {
  const { id, page, run, current, by, direction } = req.query;

  if (id || run) {
    model
      .findOne({
        ...defExclude(),
        include: [
          {
            association: new HasMany(model, models.questionLink, {
              sourceKey: "id",
              foreignKey: "questionId",
            }),
            ...defExclude(),
          },
        ],
        where: { id },
      })
      .then(async (data) => {
        const other = data?.toJSON() ?? {};

        if (run) {
          if (current) {
            other.runId = await models.questionRun.findOne({
              attributes: ["options", "id", "time"],
              where: { id: current, done: { [Op.not]: true } },
            });
          }

          if (!other.runId) {
            const newCurrent = await models.questionRun.create({
              questionId: data?.id,
              time: 0,
            });

            other.runId = {
              options: newCurrent.options,
              id: newCurrent.id,
              time: newCurrent.time,
            };
          }

          other.questionLinks = other.questionLinks?.map?.((i) => {
            const { options, questionId, ...other } = i;
            other.options = options?.map?.((i) => {
              const { correct, description, ...other } = i;

              return other;
            });

            return other;
          });

          other.activeStep = other.runId?.options?.length || 0;
        }

        return other;
      })
      .defAnswer(res);
    return;
  }

  const order = [
    ...(orderBy[by] ? [[orderBy[by], direction]] : []),
    "createdAt",
  ];

  model
    .findAll({
      ...defExclude(
        ["options", "type", "countRun"],
        [
          "createdAt",
          getFieldCount(models.questionLink, "question", "countData"),
        ]
      ),
      limit: 50,
      offset: (page ?? 0) * 50,
      order,
    })
    .defAnswer(res);
};

const post = async (req, res) => {
  const { options, ...other } = req.body;

  model
    .create(other)
    .then(async (data) => {
      await models.questionLink.bulkCreate(
        options.map((i) => {
          const { id, ...other } = i;
          other.questionId = data.id;

          return other;
        })
      );
    })
    .defAnswer(res);
};

const update = async (req, res) => {
  const { id, media, options, ...other } = req.body;

  model
    .update(other, { where: { id } })
    .then(async () => {
      await models.questionLink.destroy({ where: { questionId: id } });

      await models.questionLink.bulkCreate(
        options.map((i) => {
          const { id, ...other } = i;

          other.questionId = req.body.id;

          return other;
        })
      );
    })
    .defAnswer(res);
};

module.exports = (router) => {
  router.get("/", get);
  router.post(
    "/",
    mediaMiddleware,
    checkVal(["options", "caption"], "body"),
    post
  );
  router.put(
    "/",
    mediaMiddleware,
    checkVal(["id", "options", "caption"], "body"),
    update
  );
  router.delete(
    "/",
    ...defDelete(model, (id) => {
      models.questionLink.destroy({ where: { questionId: id } });
    })
  );

  return !!model;
};
