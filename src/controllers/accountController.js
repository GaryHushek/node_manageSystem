const path = require("path");
// 第三方生成图片验证码模块
const captchapng = require("captchapng");
const express = require("express");
const app = express();
// 引入自己封装的数据库操作模块
const db = require("../tools/db");

// 登陆页面
exports.login = (req, res) => {
  // console.log(req);
  res.status(200).sendFile(path.join(__dirname, "../views/login.html"));
};
// 发送验证码
exports.vcode = (req, res) => {
  // 随机生成的验证码
  const random = parseInt(Math.random() * 9000 + 1000);
  // 验证码存入session
  req.session.vcode = random;
  const p = new captchapng(80, 30, random); // width,height,numeric captcha
  p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
  p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
  let img = p.getBase64();
  let imgbase64 = new Buffer(img, "base64");
  res.writeHead(200, {
    "Content-Type": "image/png"
  });
  res.end(imgbase64);
};
// 登陆
exports.dologin = (req, res) => {
  // 获取到用户,密码,验证码
  const { username, password, vcode } = req.body;
  // 验证码匹配
  if (vcode != req.session.vcode) {
    // 验证码错误
    res.send({ status: 0, message: "验证码错误!" });
    return;
  }
  db.find({
    collections: "user",
    findCriteria: {
      username,
      password
    },
    success: result => {
      console.log(result);
      // 判断查询数据的长度
      if (result.length != 0) {
        res.status(200).send({ status: 1, message: "登陆成功!" });
      } else {
        res.status(200).send({ status: 0, message: "用户名或密码错误!" });
      }
    }
  });
};
// 注册
exports.doregister = (req, res) => {
  // 获取用户名,密码,验证码
  const { username, password, vcode } = req.body;
  if (vcode != req.session.vcode) {
    // 验证码错误
    res.send({ status: 0, message: "验证码错误!" });
    return;
  }
  // 使用封装好的模块查询用户名是否存在
  db.find({
    collections: "user",
    findFlag: "one",
    findCriteria: { username },
    success: doc => {
      if (doc) {
        // 用户名存在
        res.status(200).send({ status: 1, message: "用户名已存在!" });
      } else {
        // 用户名不存在
        // 插入数据
        db.insert({
          collections: "user",
          insertdata: {
            username,
            password
          },
          success: backData => {
            // 判断是否新增成功
            if (backData.result.n === 1) {
              // 响应结束
              res.status(200).send({ status: 1, message: "注册成功!" });
            } else {
              // 响应结束
              res.status(200).send({ status: 0, message: "注册成功!" });
            }
          }
        });
      }
    }
  });
};
