const router = require("koa-router")();
const {
  getList,
  getDetail,
  newBlog,
  updataBlog,
  delBlog,
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const loginCheck = require("../middleware/loginCheck");
// 定义前缀
router.prefix("/api/blog");

// 路由 /api/blog/list
router.get("/list", loginCheck, async function (ctx, next) {
  let author = ctx.query.author || "";
  const keyword = ctx.query.keyword || "";

  if (ctx.query.isAdmin) {
    if (ctx.session.username == null) {
      ctx.body = new ErrorModel("未登录");
    }
    return;
  }
  // 强制查询自己的博客
  author = ctx.session.username;
  const listData = await getList(author, keyword);
  ctx.body = new SuccessModel(listData);
});

// 获取详情路由
router.get("/detail", async function (ctx, next) {
  const data = await getDetail(ctx.query.id);
  ctx.body = new SuccessModel(data);
});
// 新建
router.post("/new", loginCheck, async (ctx, next) => {
  const body = ctx.request.body;
  body.author = ctx.session.username;
  const data = await newBlog(body);
  ctx.body = new SuccessModel(data);
});
// 更新
router.post("/update", loginCheck, async (ctx, next) => {
  const result = updataBlog(req.query.id, req.body);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel(val));
    } else {
      res.json(new ErrorModel("更新博客失败"));
    }
  });
});
// 删除
router.post("/del", loginCheck, async (ctx, next) => {
  const author = req.session.username;
  const result = delBlog(req.query.id, author);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel("删除失败"));
    }
  });
});
module.exports = router;
