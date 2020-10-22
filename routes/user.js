const router = require("koa-router")();

// 定义前缀
router.prefix("/api/user");

// 路由 /api/user/login
router.post("/login", async function (ctx, next) {
  const { username, password } = ctx.request.body;
  ctx.body = {
    errno: 0,
    username,
    password,
  };
});

router.get("/session-test", async function (ctx, next) {
  console.log(ctx.session);
  if (ctx.session.viewCount == null) {
    ctx.session.viewCount = 0;
  }
  ctx.session.viewCount++;
  ctx.body = {
    errno: 0,
    viewCount: ctx.session.viewCount,
  };
});

module.exports = router;
