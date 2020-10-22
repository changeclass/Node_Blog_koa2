const router = require("koa-router")();

// 定义前缀
router.prefix("/api/blog");

// 路由 /api/blog/list
router.get("/list", async function (ctx, next) {
  const query = ctx.query;
  ctx.body = {
    errno: 0,
    query,
    data: ["博客列表"],
  };
});

module.exports = router;
