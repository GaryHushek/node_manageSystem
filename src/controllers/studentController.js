// 处理学生页面路由的控制器
const path = require("path");
// 引入xtpl
const xtpl = require("xtpl");
// 引入封装好的数据库工具模块
const db = require("../tools/db");
// 引入mongodb官方的objectid模块
const objectID = require("objectid");

// 学生信息列表页
exports.list = (req, res) => {
  // 使用promise异步对象
  let find = new Promise((resolve, reject) => {
    // 读取数据库,查询所有的学生信息
    db.find({
      collections: "studentInfo",
      success: result => {
        // 如果成功,带着结果执行成功的回调
        resolve(result);
      }
    });
  });
  // 执行查找成功后回调
  find.then(result => {
    // 查询登陆用户信息
    const username = req.session.username;
    xtpl.renderFile(
      path.join(__dirname, "../views/list.html"),
      { studentList: result, username },
      (err, content) => {
        res.status(200).send(content);
      }
    );
  });
};
// 查询学生信息
exports.search = (req, res) => {
  // 拿到传入查询的名字
  const { name } = req.query;
  // 判断是否名字是否为空,为空就是搜索所有
  if (!name) {
    // 为空,调用list方法查询所有的学生信息
    this.list(req, res);
  } else {
    // 创建一个正则对象,模糊查询输入的学生信息
    //                  (正则规则,i== 大小写不敏感的匹配)
    let reg = new RegExp(name, "i");
    // 使用promise异步对象
    let find = new Promise((resolve, reject) => {
      // 读取数据库,查询所有的学生信息
      db.find({
        collections: "studentInfo",
        findCriteria: { name: reg },
        success: result => {
          // 如果成功,带着结果执行成功的回调
          resolve(result);
        }
      });
    });
    // 执行查找成功后回调
    find.then(result => {
      console.log(result);
      xtpl.renderFile(
        path.join(__dirname, "../views/list.html"),
        { studentList: result, keyword: name },
        (err, content) => {
          res.status(200).send(content);
        }
      );
    });
  }
};
// 新增学生页面
exports.add = (req, res) => {
  const username = req.session.username;
  xtpl.renderFile(
    path.join(__dirname, "../views/add.html"),
    { username },
    (err, content) => {
      res.status(200).send(content);
    }
  );
};
// 处理新增学生事件
exports.doadd = (req, res) => {
  // 获取到post请求主体
  const { name, age, sex, phone, address, introduction } = req.body;
  db.insert({
    collections: "studentInfo",
    insertData: {
      name,
      age,
      sex,
      phone,
      address,
      introduction
    },
    success: result => {
      console.log(result);
      if (result.result.n == 1) {
        // 新增成功,回学生信息列表页面
        res
          .status(200)
          .end(
            '<script>window.location.href = "/studentManager/list"</script>'
          );
      } else {
        // 新增失败,回新增页面
        res
          .status(200)
          .end('<script>window.location.href = "/studentManager/add"</script>');
      }
    }
  });
};
// 处理删除一条学生信息事件
exports.delete = (req, res) => {
  // 拿到删除id
  const { id } = req.query;
  console.log(id);
  db.delete({
    collections: "studentInfo",
    deleteOne: {
      _id: objectID(id)
    },
    success: result => {
      // 判断是否删除成功
      if (result.deletedCount === 1) {
        // 删除成功
        // res.status(200).send({ status: 1, message: "删除成功!" });
        // 去首页
        this.list(req, res);
      } else {
        // 删除失败
        // res.status(200).send({ status: 10, message: "删除失败!" });
        this.list(req, res);
      }
    }
  });
};
// 处理编辑学生信息页面事件
exports.edit = (req, res) => {
  const { id } = req.query;
  // 使用promise异步对象
  let find = new Promise((resolve, reject) => {
    // 读取数据库,查询所有的学生信息
    db.find({
      collections: "studentInfo",
      findFlag: "one",
      findCriteria: {
        _id: objectID(id)
      },
      success: result => {
        // 如果成功,带着结果执行成功的回调
        resolve(result);
      }
    });
  });
  find.then(result => {
    // 查询数据成功后执行,读取eddit.html文件,用查询过来的数据替换
    const { name, age, sex, phone, address, introduction } = result;
    const username = req.session.username;
    xtpl.renderFile(
      path.join(__dirname, "../views/edit.html"),
      {
        student: {
          id,
          name,
          age,
          sex,
          phone,
          address,
          introduction
        },
        username
      },
      (err, content) => {
        res.status(200).send(content);
      }
    );
  });
};

// 处理编辑一条学生信息事件
exports.doedit = (req, res) => {
  const id = req.params.studentID;
  // 获取学生信息
  const { name, age, sex, phone, address, introduction } = req.body;
  console.log(id, name, age, sex, phone, address, introduction);
  // 更新学生信息
  db.update({
    collections: "studentInfo",
    updateFlag: "one",
    updateCriteria: {
      _id: objectID(id)
    },
    updateData: {
      $set: {
        name,
        age,
        sex,
        phone,
        address,
        introduction
      }
    },
    success: result => {
      if (result.result.n === 1) {
        // 更新成功,回列表页
        res
          .status(200)
          .end(
            '<script>window.location.href = "/studentManager/list"</script>'
          );
      } else {
        // 更新失败,回更新页
        res.status(200).end('<script>alert("更新失败!")</script>');
      }
    }
  });
};
