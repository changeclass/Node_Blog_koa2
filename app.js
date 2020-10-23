const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const session = require("koa-generic-session");
const redisStore = require("koa-redis");

const path = require("path");
const fs = require("fs");
const morgan = require("koa-morgan");
// 配置
const { REDIS_CONF } = require("./conf/db");

// const index = require("./routes/index");
// const users = require("./routes/users");
const blog = require("./routes/blog");
const user = require("./routes/user");

// error handler
onerror(app);

// middlewares
// 处理post的数据格式
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
// 日志
app.use(logger());
// 静态目录
app.use(require("koa-static")(__dirname + "/public"));
// 视图层 模板
app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  // 当前请求耗时
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 日志记录的级别
const ENV = process.env.NODE_ENV; // 当前运行的环境
if (ENV !== "production") {
  app.use(
    // 开发环境 测试环境
    morgan("dev", {
      stream: process.stdout,
    })
  );
} else {
  const logFileName = path.join(__dirname, "logs", "access.log");
  const writeStream = fs.createWriteStream(logFileName, {
    flags: "a",
  });
  app.use(
    // 线上环境
    morgan("combined", {
      stream: writeStream,
    })
  );
}

// session配置
app.keys = ["12323213sad"]; // 设置session加密密匙
app.use(
  session({
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: redisStore({
      all: `${REDIS_CONF.host}:${REDIS_CONF.port}`, // 写死本地的server
    }),
  })
);
// routes
// app.use(index.routes(), index.allowedMethods());
// app.use(users.routes(), users.allowedMethods());
app.use(blog.routes(), blog.allowedMethods());
app.use(user.routes(), user.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
