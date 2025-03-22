const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * addColumn(deletedAt) => "media"
 * addColumn(deletedAt) => "questions"
 * addColumn(deletedAt) => "questionLinks"
 * addColumn(deletedAt) => "questionRuns"
 *
 */

const info = {
  revision: 6,
  name: "addParanoid",
  created: "2025-03-22T09:02:38.103Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "addColumn",
    params: [
      "media",
      "deletedAt",
      { type: Sequelize.DATE, field: "deletedAt" },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "questions",
      "deletedAt",
      { type: Sequelize.DATE, field: "deletedAt" },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "questionLinks",
      "deletedAt",
      { type: Sequelize.DATE, field: "deletedAt" },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "questionRuns",
      "deletedAt",
      { type: Sequelize.DATE, field: "deletedAt" },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["media", "deletedAt", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["questions", "deletedAt", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["questionLinks", "deletedAt", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["questionRuns", "deletedAt", { transaction }],
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
