const router = require("koa-router")();
const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// 定义前缀
router.prefix("/api/user");

// 路由 /api/user/login
router.post("/login", async function (ctx, next) {
  const { username, password } = ctx.request.body;
  const data = await login(username, password);
  if (data.username) {
    // 操作Session
    ctx.session.username = data.username;
    ctx.session.realName = data.realName;
    ctx.body = new SuccessModel("登陆成功");
    return;
  } else {
    ctx.body = new ErrorModel("登陆失败");
  }
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
