const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeColumn(setting) => "questionLinks"
 * createTable() => "questionRuns", deps: [questions]
 * addColumn(options) => "questionLinks"
 *
 */

const info = {
  revision: 3,
  name: "addRun",
  created: "2025-03-22T08:10:42.596Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["questionLinks", "setting", { transaction }],
  },
  {
    fn: "createTable",
    params: [
      "questionRuns",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
        },
        setting: { type: Sequelize.JSONB, field: "setting" },
        caption: { type: Sequelize.TEXT, field: "caption" },
        description: { type: Sequelize.TEXT, field: "description" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        questionId: {
          type: Sequelize.UUID,
          field: "questionId",
          onUpdate: "NO ACTION",
          onDelete: "CASCADE",
          references: { model: "questions", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "questionLinks",
      "options",
      { type: Sequelize.JSONB, field: "options" },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["questionLinks", "options", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["questionRuns", { transaction }],
  },
  {
    fn: "addColumn",
    params: [
      "questionLinks",
      "setting",
      { type: Sequelize.JSONB, field: "setting" },
      { transaction },
    ],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
