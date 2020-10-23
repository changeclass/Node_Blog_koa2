const { ErrorModel } = require("../model/resModel");

module.exports = async (ctx, next) => {
  console.log(ctx.session.username, 123);
  if (ctx.session.username) {
    await next();
    return;
  }
  ctx.body = new ErrorModel("未登陆");
};
