const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * renameColumn(setting) => "questionRuns"
 * addColumn(time) => "questionRuns"
 * addColumn(done) => "questionRuns"
 *
 */

const info = {
  revision: 7,
  name: "addRun4",
  created: "2025-03-22T09:44:32.004Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "renameColumn",
    params: ["questionRuns", "setting", "option"],
  },
  {
    fn: "addColumn",
    params: [
      "questionRuns",
      "time",
      { type: Sequelize.INTEGER, field: "time" },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "questionRuns",
      "done",
      { type: Sequelize.BOOLEAN, field: "done" },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "renameColumn",
    params: ["questionRuns", "option", "setting"],
  },
  {
    fn: "removeColumn",
    params: ["questionRuns", "time", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["questionRuns", "done", { transaction }],
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
