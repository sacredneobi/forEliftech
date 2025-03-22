const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "media", deps: [questions, questionLinks]
 *
 */

const info = {
  revision: 2,
  name: "addMedia",
  created: "2025-03-22T08:07:15.703Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "media",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
        },
        fileId: { type: Sequelize.TEXT, field: "fileId" },
        name: { type: Sequelize.TEXT, field: "name" },
        size: { type: Sequelize.INTEGER, field: "size" },
        mimeType: { type: Sequelize.TEXT, field: "mimeType" },
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
        questionLinkId: {
          type: Sequelize.UUID,
          field: "questionLinkId",
          onUpdate: "NO ACTION",
          onDelete: "CASCADE",
          references: { model: "questionLinks", key: "id" },
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
    params: ["media", { transaction }],
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
