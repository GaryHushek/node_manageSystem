// 引入path模块
const path = require("path");
// 引入express模块
const express = require("express");
// 引入session模块
const session = require("express-session");
// 创建app
const app = express();
// 使用静态资源中间件
app.use(express.static(path.join(__dirname, "./src/statics")));
// 引入集成的账户路由中间件
const accountRouter = require(path.join(
  __dirname,
  "./src/routers/accountRouter"
));
// 引入集成学生路由中间件
const studentRouter = require(path.join(
  __dirname,
  "./src/routers/studentRouter"
));
// 解析post请求的中间件
const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded  解析普通post请求主体
app.use(bodyParser.urlencoded({ extended: false }));
// Use the session middleware 使用session中间件
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true  // 初始化值 (true 只要第一次访问就已经开辟了session空间)
}))

// 使用账户路由中间件处理浏览器请求
app.use("/account", accountRouter);
// 使用学生路由中间件处理浏览器请求
app.use("/studentManager", studentRouter);

// 开启web服务
app.listen(3000, "127.0.0.1", err => {
  // 处理异常
  if (err) throw err;
  // 友好性提示
  console.log("This server is running at http://127.0.0.1:3000");
});
