// 引入path模块
const path = require("path");
// 引入express
const express = require("express");
// 创建路由对象
const accountRouter = express.Router();
// 数据库模块
const db = require("../tools/db");
// 引入账户控制器模块
const accountController = require(path.join(
  __dirname,
  "../controllers/accountController"
));
// 使用控制器中间件处理路由的请求
// 登录页面请求
accountRouter.get("/login", accountController.login);
// 验证码请求
accountRouter.get("/vcode", accountController.vcode);
// 登陆
accountRouter.post("/dologin", accountController.dologin);
// 注册
accountRouter.post("/doregister", accountController.doregister);

// 导出路由
module.exports = accountRouter;
