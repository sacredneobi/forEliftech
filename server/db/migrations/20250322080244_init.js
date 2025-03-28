const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "questions", deps: []
 * createTable() => "questionLinks", deps: [questions]
 *
 */

const info = {
  revision: 1,
  name: "init",
  created: "2025-03-22T08:02:44.455Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "questions",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
        },
        options: { type: Sequelize.JSONB, field: "options" },
        type: { type: Sequelize.STRING, field: "type" },
        countRun: { type: Sequelize.INTEGER, field: "countRun" },
        countDone: { type: Sequelize.INTEGER, field: "countDone" },
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
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "questionLinks",
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
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["questionLinks", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["questions", { transaction }],
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
