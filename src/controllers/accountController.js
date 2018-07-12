const path = require("path");
// 第三方生成图片验证码模块
const captchapng = require("captchapng");
const express = require("express");
const app = express();
// 引入自己封装的数据库操作模块
const db = require("../tools/db");

// 登陆方法
exports.login = (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../views/login.html"));
};
// 发送验证码
exports.vcode = (req, res) => {
  // 随机生成的验证码
  const random = parseInt(Math.random() * 9000 + 1000);
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
  // 获取到用户名密码
  // console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
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
        console.log("登陆成功!");
        res.status(200).send({ message: "ok" });
      } else {
        console.log("登录失败!");
        res.status(404).send({ message: "not found" });
      }
    }
  });
};
// 注册
exports.doregister = (req, res) => {
  // 获取用户名,密码
  const username = req.body.username;
  const password = req.body.password;
  // 使用封装好的模块新增数据
  db.insert({
    collections: "user",
    insertdata: {
      username,
      password
    }
  });
};
