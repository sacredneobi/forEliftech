const models = require("@models");
const { defAnswer } = require("@utils");
const { literal, fn, col } = require("sequelize");

const model = models.questionRun;

const get = async (req, res) => {
  const { id } = req.query;

  if (id) {
    const data = await model.findAll({
      attributes: ["options"],
      where: { questionId: id },
    });

    let question = data?.reduce?.((p, i) => {
      i.options?.forEach?.((o) => {
        if (Array.isArray(o?.select)) {
          for (const option of o.select) {
            if (!o.id) continue;
            p[o.id] ??= [];

            const findIndex = p[o.id].findIndex(
              (i) => i.id === (option?.caption ?? option.value)
            );

            if (findIndex >= 0) {
              p[o.id][findIndex].count = p[o.id][findIndex].count + 1;
            } else {
              p[o.id].push({
                id: option?.caption ?? option.value,
                count: 1,
              });
            }
          }
        } else {
          if (!o.id) return;

          p[o.id] ??= [];

          const findIndex = p[o.id].findIndex(
            (i) => i.id === (o?.select?.caption ?? o.value)
          );

          if (findIndex >= 0) {
            p[o.id][findIndex].count = p[o.id][findIndex].count + 1;
          } else {
            p[o.id].push({ id: o?.select?.caption ?? o.value, count: 1 });
          }
        }
      });

      return p;
    }, {});

    const findOptions = await models.questionLink.findAll({
      where: { id: Object.keys(question).filter((i) => i !== "undefined") },
    });

    question = Object.keys(question).map((i) => {
      const find = findOptions.find((o) => o.id === i);

      return { question: i, variants: question[i], caption: find?.caption };
    });

    defAnswer(res)({ data: question });

    return;
  }

  const week = await model.findAll({
    attributes: [
      [
        fn(
          "max",
          fn("extract", literal('week from cast("updatedAt" as date)'))
        ),
        "label",
      ],
      [fn("COUNT", col("id")), "count"],
    ],
    group: [fn("date_trunc", "week", col("updatedAt"))],
    order: [[fn("date_trunc", "week", col("updatedAt")), "ASC"]],
  });

  const month = await model.findAll({
    attributes: [
      [
        fn(
          "max",
          fn("extract", literal('month from cast("updatedAt" as date)'))
        ),
        "label",
      ],
      [fn("COUNT", col("id")), "count"],
    ],
    group: [fn("date_trunc", "month", col("updatedAt"))],
    order: [[fn("date_trunc", "month", col("updatedAt")), "ASC"]],
  });

  const day = await model.findAll({
    attributes: [
      [
        fn("max", fn("extract", literal('day from cast("updatedAt" as date)'))),
        "label",
      ],
      [fn("COUNT", col("id")), "count"],
    ],
    group: [fn("date_trunc", "day", col("updatedAt"))],
    order: [[fn("date_trunc", "day", col("updatedAt")), "ASC"]],
  });

  const result = await model.findOne({
    attributes: [[fn("AVG", col("time")), "avg_time"]],
  });

  defAnswer(res)({
    avg: Math.trunc(result?.toJSON?.()?.avg_time ?? 0),
    week: week.map((i) => i.toJSON()),
    month: month.map((i) => i.toJSON()),
    day: day.map((i) => i.toJSON()),
  });
};

module.exports = (router) => {
  router.get("/", get);

  return !!model;
};
