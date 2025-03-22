const dayjs = require("dayjs");
const fs = require("fs");
const util = require("util");

const getDate = (withOutTime) =>
  dayjs().format(withOutTime ? "DD.MM.YYYY" : "DD.MM.YYYY HH:mm:ss.SSS");

const myArgs = process.argv.slice(2);

const showDebug = myArgs.includes("debug");

const color = Object.entries({
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  empty: 0,
}).reduce((p, i) => ({ ...p, [i[0]]: `\x1b[${i[1]}m` }), {});

const colors = Object.keys(color).reduce((p, i) => [...p, color[i]], []);

const getName = (name) => {
  return (
    (Array.isArray(name)
      ? name.map((i) => i?.toUpperCase?.())?.join?.("][") ?? i
      : name) || ""
  );
};

if (!fs.existsSync(`./logs`)) {
  fs.mkdirSync(`./logs`);
}

const oldConsole = console.log;

let nowStart;
let currentStream;

const getStream = () => {
  let fileName = `./logs/log_${getDate(true)}.log`;

  if (process?.setting?.log?.splitByRun) {
    let index = 0;
    fileName = `./logs/log_${getDate(true)}_${index}.log`;
    while (fs.existsSync(fileName)) {
      fileName = `./logs/log_${getDate(true)}_${index}.log`;
      index++;
    }
  }

  return fs.createWriteStream(fileName, { flags: "a" });
};

const logFile = () => {
  if (nowStart !== getDate(true)) {
    nowStart = getDate(true);
    if (currentStream) {
      currentStream.close((err) => {
        oldConsole("close", err);
      });
    }
    currentStream = getStream();
  }
  return currentStream;
};

console.log = function () {
  const logLine = util.format
    .apply(null, arguments)
    .split("\n")
    .join(`\n${"".padStart(getDate().length + 3, " ")}`);

  let message2 = logLine;

  colors.forEach((i) => {
    message2 = message2.replaceAll(i, "");
  });

  logFile().write(`[${getDate()}] ${message2}\n`);

  if (process.setting?.log?.debug || showDebug) {
    oldConsole(`${color.yellow}${getDate()}${color.empty} | ${logLine}`);
  }
};

console.error = function (name, ...args) {
  const newName = getName(name);

  console.log(
    `${color.red}[ERROR]${args.length > 0 ? `[${newName}]` : ""}${
      color.empty
    }:`,
    ...(args.length > 0 ? args : [newName])
  );
};

console.clearAll = () => {
  process.stdout.write("\033c");
  process.stdout.write("\u001b[0J\u001b[1J\u001b[2J\u001b[0;0H\u001b[0;0W");
};

console.done = function (name, ...args) {
  const newName = getName(name);

  console.log(`${color.green}[DONE][${newName}]${color.empty}:`, ...args);
};

console.user = function (name, ...args) {
  const newName = getName(name);
  console.log(`${color.blue}[LOG][${newName}]${color.empty}:`, ...args);
};

if (process.setting?.log?.debug) {
  console.clearAll();
}

const split = "-".repeat(25);
logFile().write(`${split}\n ${getDate()}\n${split}\n`);

console.done("VERSION", process.setting?.version);
