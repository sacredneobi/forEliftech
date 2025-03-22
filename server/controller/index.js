const { Router } = require("express");
const private = require("./private");

const initRouter = (webServer, routers) => {
  if (!webServer || !Array.isArray(routers?.controllers) || !routers?.path) {
    if (!Array.isArray(routers?.controllers) || !routers?.path) {
      console.log(`Контроллер ${routers?.path} неверный`);
      return;
    }
    console.log("Веб сервер не найден");
    return;
  }

  const router = new Router();
  routers.controllers.forEach((item) => {
    if (item.name && item.router) {
      router.use(item.name, item.router);
    }
  });
  webServer.use(routers.path, router);
};

const initLoad = (webServer) => {
  initRouter(webServer, private);
};

module.exports = initLoad;
