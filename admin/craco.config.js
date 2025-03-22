const path = require("path");
const fs = require("fs");
const evalSourceMap = require("react-dev-utils/evalSourceMapMiddleware");
const redirectServedPath = require("react-dev-utils/redirectServedPathMiddleware");
const noopServiceWorker = require("react-dev-utils/noopServiceWorkerMiddleware");

const resolvePath = (p) => path.resolve(__dirname, p);

const plugins = [];

module.exports = {
  webpack: {
    plugins,
    alias: {
      "@api": resolvePath("./src/api"),
      "@context": resolvePath("./src/context"),
      "@data": resolvePath("./src/data"),
      "@hooks": resolvePath("./src/hooks"),
      "@localComponents": resolvePath("./src/localComponents"),
    },
  },
  eslint: false,
  devServer: (devServerConfig, { env, paths }) => {
    devServerConfig = {
      ...devServerConfig,
      onBeforeSetupMiddleware: undefined,
      onAfterSetupMiddleware: undefined,
      setupMiddlewares: (middleware, devServer) => {
        if (!devServer) {
          throw new Error("webpack-dev-server is not defined");
        }

        if (fs.existsSync(paths.proxySetup)) {
          require(paths.proxySetup)(devServer.app);
        }

        middleware.push(
          evalSourceMap(devServer),
          redirectServedPath(paths.publicUrlOrPath),
          noopServiceWorker(paths.publicUrlOrPath)
        );

        return middleware;
      },
      proxy: {
        "/api": {
          target: "http://localhost:4002",
          changeOrigin: true,
          onProxyReq: (proxyReq, req, res) => {
            const clientIp =
              req.headers["x-forwarded-for"]?.split(",")[0] ||
              req.ip ||
              req.connection.remoteAddress;
            proxyReq.setHeader("X-Forwarded-For", clientIp);
          },
        },
      },
    };
    devServerConfig.client.overlay.warnings = true;
    devServerConfig.client.webSocketURL = "auto://0.0.0.0/ws";

    return devServerConfig;
  },
};
