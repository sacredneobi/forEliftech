const fs = require("fs");
const path = require("path");

const content = (prefix) => {
  return `
[Unit]
Description=SACRED APP ${prefix}
Documentation=
After=network.target

[Service]
Type=simple
ExecStart="${process.argv[0]}"
WorkingDirectory=${path.dirname(process.argv[0])}
Restart=on-failure

[Install]
WantedBy=multi-user.target
`;
};

module.exports = () => {
  console.done("Создание файла");

  const newPrefix = process.setting?.serviceName
    ? process.setting.serviceName
    : "";

  let fileName = `sacred_server.service`;
  const filePath = "/lib/systemd/system/";

  if (process.setting?.serviceName) {
    console.log("Использование префикса для сервиса:", newPrefix);
    fileName = `sacred_server_${newPrefix}.service`;
  }

  try {
    fs.writeFileSync(`${filePath}${fileName}`, content(newPrefix));
    console.log(`Создан сервис: ${filePath}${fileName}`);
    console.log(
      `Для запуска выполните:\n\n\tsudo systemctl enable ${fileName}\n\tsudo systemctl start ${fileName}`
    );
  } catch (err) {
    console.error("Ошибка создания файла", err);
  }
};
