const { checkVal } = require("../express");

const defLog = () => {};

const defDelete = (model, onDelete, onBeforeDelete) => [
  checkVal(["id"], "body"),
  async (req, res) => {
    const { id } = req.body;
    if (onBeforeDelete) {
      await onBeforeDelete(id);
    }
    model
      .destroy({ where: { id } })
      .then(async () => {
        await onDelete?.(id);
        return { id, delete: true };
      })
      .defAnswer(res);
  },
];

module.exports = { defDelete };
