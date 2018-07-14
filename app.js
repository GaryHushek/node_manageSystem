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
// Use the session middleware 使用session中间件
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true, // 初始化值 (true 只要第一次访问就已经开辟了session空间)
    cookie: {
      maxAge: 1000 * 60 * 30 // 设置session过期时间 30分钟
    }
  })
);

// 拦截浏览器的所有请求
app.all("*", (req, res, next) => {
  if (req.url.includes("account")) {
    // 账号相关直接过
    next();
  } else {
    // 后台操作相关的验证是否登陆
    // 设置session一定要在验证session之前,否则req.session就是undefined报错
    if (req.session.username) {
      next();
    } else {
      res.status(200).send('<script>location.href="/account/login"</script>');
    }
  }
});
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
