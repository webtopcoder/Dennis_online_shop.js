const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { runServerStartupLogs } = require("./lib/serverStartup.js");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  runServerStartupLogs();
  createServer((req, res) => {
    const parsed = parse(req.url, true);
    handle(req, res, parsed);
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`ready - started server on http://${hostname}:${port}`);
  });
});
