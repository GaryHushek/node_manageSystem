// 学生页面路由
// 导入需要的模块
const path = require("path");
// 引入express
const express = require("express");
// 创建路由对象
const studentRouter = express.Router();
// 引入学生控制器模块
const studentController = require(path.join(
  __dirname,
  "../controllers/studentController"
));

// 学生信息列表页路由委派
studentRouter.get("/list", studentController.list);
// 查询学生事件委派
studentRouter.get("/search", studentController.search);
// 新增学生信息页面路由委派
studentRouter.get("/add", studentController.add);
// 新增学生信息事件路由委派
studentRouter.post("/doadd", studentController.doadd);
// 删除学生信息事件路由委派
studentRouter.get("/delete", studentController.delete);
// 编辑学生信息页面路由委派
studentRouter.get("/edit", studentController.edit);
// 编辑学生信息事件路由委派
studentRouter.post("/doedit", studentController.doedit);

// 导出处理有关学生的路由模块
module.exports = studentRouter;
