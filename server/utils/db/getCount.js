const models = require("@models");
const { literal, fn, col, where } = require("sequelize");

const getFieldCount = (model, link, name, field) => {
  return [
    literal(
      models.selectQuery(model, {
        attributes: [[fn("count", col(field ?? "id")), "counter"]],
        where: [where(col(`${link}Id`), col(`${link}.id`))],
      })
    ),
    name ?? "count",
  ];
};

const getFieldSum = (model, link, name, field, whereEx) => {
  return [
    literal(
      models.selectQuery(model, {
        attributes: [
          [
            fn(
              "sum",
              typeof field !== "string" ? field : col(field ?? "count")
            ),
            "sum",
          ],
        ],
        where: [where(col(`${link}Id`), col(`${link}.id`)), ...(whereEx ?? [])],
      })
    ),
    name ?? "sum",
  ];
};

const getFieldValue = (field) => fn("COALESCE", col(field), 0);
const getFieldMultiply = (first, second) =>
  where(getFieldValue(first), "*", getFieldValue(second));

module.exports = {
  getFieldCount,
  getFieldSum,
  getFieldValue,
  getFieldMultiply,
};
