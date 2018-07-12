// 引入path模块
const path = require("path");
// 引入express
const express = require("express");
// 创建app
const app = express();
// 使用静态资源中间件
app.use(express.static(path.join(__dirname, "./src/statics")));
// 引入集成中间件
const accountRouter = require(path.join(
  __dirname,
  "./src/routers/accountRouter"
));
// 解析post请求的中间件
const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded  解析普通post请求主体
app.use(bodyParser.urlencoded({ extended: false }));

// 使用路由中间件处理浏览器请求
app.use("/account", accountRouter);
// 开启web服务
app.listen(3000, "127.0.0.1", err => {
  // 处理异常
  if (err) throw err;
  // 友好性提示
  console.log("This server is running at http://127.0.0.1:3000");
});
