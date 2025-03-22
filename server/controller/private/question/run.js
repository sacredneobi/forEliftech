const models = require("@models");
const {
  checkVal,
  defExclude,
  buildLimit,
  defDelete,
  mediaMiddleware,
} = require("@utils");
const { HasMany } = require("sequelize");

const model = models.questionRun;

const get = async (req, res) => {
  const { id, limit, offset } = req.query;

  if (id) {
    model
      .findOne({
        ...defExclude(),
        include: [{ model: models.question, ...defExclude() }],
        where: { id },
      })
      .defAnswer(res);
    return;
  }

  const findCount = await model.findAndCountAll({
    ...buildLimit(limit, offset, [], ["createdAt"]),
    order: ["createdAt"],
  });

  model
    .findAll({
      ...defExclude(["options", "type"], ["createdAt"]),
      include: [{ model: models.question, ...defExclude() }],

      where: { id: findCount?.rows?.map?.((i) => i.id) },
      order: ["createdAt"],
    })
    .defAnswer(res);
};

const post = (req, res) => {
  const { id, answers } = req.body;

  model
    .findOne({
      include: [
        {
          association: new HasMany(model, models.questionLink, {
            sourceKey: "questionId",
            foreignKey: "questionId",
          }),
        },
        { model: models.question },
      ],
      where: { id },
    })
    .then(async (data) => {
      if (data) {
        await models.questionRun.update({ done: true }, { where: { id } });

        const question = await models.question.findOne({
          where: { id: data.question?.id },
        });

        if (question) {
          question.countDone = question.countDone + 1;
          await question.save();
        }

        // await models.questionRun.update({ countDone: true }, { where: { id: data.question?.id } });
      }
      const other = data?.toJSON() ?? {};

      if (other?.questionLinks?.length > 0) {
        const result = answers.map((i) => {
          const find = other.questionLinks.find((q) => q.id === i.id);

          if (find) {
            if (find.type === "multi") {
              return {
                ...i,
                correct:
                  find.options.filter((c) => c.id === i.value && c.correct)
                    ?.length > 0,
                answer: find.options
                  .filter((i) => i.correct)
                  .map((i) => ({ caption: i.caption })),
              };
            }
            if (find.type === "single") {
              return {
                ...i,
                correct:
                  find.options.filter((c) => c.id === i.value && c.correct)
                    ?.length > 0,
                answer: find.options
                  .filter((i) => i.correct)
                  .map((i) => ({ caption: i.caption })),
              };
            }
            if (find.type === "text") {
              return {
                ...i,
                correct:
                  String(find.correct)?.toLocaleLowerCase() ===
                  String(i.value)?.toLocaleLowerCase(),
                answer: [{ caption: find.correct }],
              };
            }
          }
        });
        // console.log(other);
        // console.log(answers);
        return result;
      }
    })
    .defAnswer(res);
};

const update = async (req, res) => {
  const { id, option, ...other } = req.body;

  if (option) {
    const oldData =
      (
        await model.findOne({
          include: [{ model: models.question }],
          where: { id },
        })
      )?.toJSON?.() ?? {};

    other.options = [...(oldData.options ?? []), option];

    const question = await models.question.findOne({
      where: { id: oldData.question?.id },
    });

    if (question) {
      question.countRun = question.countRun + 1;
      await question.save();
    }
  }

  model
    .update(other, { where: { id } })
    .then(async () => {})
    .defAnswer(res);
};

module.exports = (router) => {
  router.get("/", get);
  router.post("/", mediaMiddleware, checkVal(["id", "answers"], "body"), post);
  router.put("/", mediaMiddleware, checkVal(["id"], "body"), update);
  router.delete(
    "/",
    ...defDelete(model, (id) => {
      models.questionLink.destroy({ where: { questionId: id } });
    })
  );

  return !!model;
};
