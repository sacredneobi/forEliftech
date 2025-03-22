const getBelongs = (model, target, as) =>
  model.belongsTo(target, {
    ...(as && { as }),
    onUpdate: "NO ACTION",
    onDelete: "CASCADE",
  });

module.exports = { getBelongs };
