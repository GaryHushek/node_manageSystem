// 引入需要的模块
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
// mongoDB连接的url
const url = "mongodb://localhost:27017";
// mongoDB连接的DataBase名
const dbname = "students";

const db = {
  /**
   * 新增数据
   * options:{
   *    collections: String 连接那个集合(必填)
   *    insertData: Object || Array 插入的数据 Obj:插入一条  Arrary:插入多条
   *    fail(err): Function 新增失败的回调(选填) 默认打印失败信息
   *    success(res): Function 新增成功的回调(选填,会把新增操作的结果对象传入回调) 默认打印成功信息
   * }
   */
  insert: options => {
    // 连接数据库
    MongoClient.connect(
      url,
      { useNewUrlParser: true },
      (err, client) => {
        if (err) {
          // 关闭数据库连接
          client.close();
          if (!options.fail) {
            console.log(err);
          } else {
            // 执行
            options.fail(err);
          }
        } else {
          console.log("连接成功!");
          // 连接集合
          const dbc = client.db(dbname);
          // 判断用户插入的是一条还是多条
          if (
            Object.prototype.toString.call(options.insertData) ==
            "[object Object]"
          ) {
            // 插入的是对象（一条数据）
            dbc
              .collection(options.collections)
              .insertOne(options.insertData, (err, res) => {
                if (err) throw err;
                // 关闭数据库连接
                client.close();
                // 执行用户传入的回调
                if (options.success) {
                  options.success(res);
                } else {
                  console.log("文档插入成功!插入数据如下:");
                  console.log(res.ops);
                }
              });
          } else if (
            Object.prototype.toString.call(options.insertData) ==
            "[object Array]"
          ) {
            // 插入的是数组（多条数据）
            dbc
              .collection(options.collections)
              .insertMany(options.insertData, (err, res) => {
                if (err) throw err;
                // 关闭数据库连接
                client.close();
                // 执行用户传入的回调
                if (options.success) {
                  options.success(res);
                } else {
                  console.log("文档插入成功!插入数据如下:");
                  console.log(res.ops);
                }
              });
          } else {
            // 关闭数据库连接
            client.close();
            if (options.fail) {
              options.fail();
            } else {
              // 传入异常数据,关闭数据库连接
              console.log("插入数据类型异常,请传入对象或对象数组!");
            }
          }
        }
      }
    );
  },
  /**
   * 删除数据
   * options:{
   *    collections: String 连接那个集合(必填)
   *    deleteOne: Object  删除一条数据
   *    deleteMany: Object 删除多条数据
   *    fail(err): Function 删除失败的回调(选填) 默认打印失败信息
   *    success(res.deletedCount): Function 删除成功的回调(选填,会把删除的条数传入回调中) 默认打印成功信息
   * }
   */
  delete: options => {
    // 连接数据库
    MongoClient.connect(
      url,
      { useNewUrlParser: true },
      (err, client) => {
        if (err) {
          // 关闭数据库连接
          client.close();
          if (!options.fail) {
            console.log(err);
          } else {
            // 执行
            options.fail(err);
          }
        } else {
          console.log("连接成功!");
          // 连接集合
          const dbc = client.db(dbname);
          // 判断用户删除的是一条还是多条
          if (options.deleteOne) {
            // 删除一条数据
            dbc
              .collection(options.collections)
              .deleteOne(options.deleteOne, (err, res) => {
                if (err) throw err;
                // 关闭数据库
                client.close();
                // 执行用户传入的回调
                if (options.success) {
                  options.success(res);
                } else {
                  console.log("文档删除成功!");
                  console.log(res);
                }
              });
          }
          if (options.deleteMany) {
            // 删除多条数据
            dbc
              .collection(options.collections)
              .deleteMany(options.deleteMany, (err, res) => {
                if (err) throw err;
                // 执行用户传入的回调
                // 关闭数据库
                client.close();
                if (options.success) {
                  options.success(res);
                } else {
                  console.log("文档删除成功!");
                  console.log(res);
                }
              });
          }
        }
      }
    );
  },
  /**
   * 更新数据
   * options:{
   *    collections: String 连接那个集合(必填)
   *    updateFlag: one || many  one:更新一条数据 many:更新多条数据
   *    updateCriteria: Object 更新条件
   *    updateData: Object 更新数据
   *    fail(err): Function 更新失败的回调(选填) 默认打印失败信息
   *    success(res): Function 更新成功的回调(选填,会把更新的结果传入回调) 默认打印成功信息
   * }
   */
  update: options => {
    // 连接数据库
    MongoClient.connect(
      url,
      { useNewUrlParser: true },
      (err, client) => {
        if (err) {
          // 关闭数据库连接
          client.close();
          if (!options.fail) {
            console.log(err);
          } else {
            // 执行
            options.fail(err);
          }
        } else {
          console.log("连接成功!");
          // 连接集合
          const dbc = client.db(dbname);
          // 判断用户更新的是一条还是多条
          if (options.updateFlag == "one") {
            // 更新的是对象（一条数据）
            dbc
              .collection(options.collections)
              .updateOne(
                options.updateCriteria,
                options.updateData,
                (err, res) => {
                  if (err) throw err;
                  // 关闭数据库
                  client.close();
                  // 执行用户传入的回调
                  if (options.success) {
                    options.success(res);
                  } else {
                    console.log("文档更新成功!更新数据条数:");
                    console.log(res);
                  }
                }
              );
          } else if (options.updateFlag == "many") {
            // 更新的是对象（一条数据）
            dbc
              .collection(options.collections)
              .updateMany(
                options.updateCriteria,
                options.updateData,
                (err, res) => {
                  if (err) throw err;
                  // 关闭数据库
                  client.close();
                  // 执行用户传入的回调
                  if (options.success) {
                    options.success(res);
                  } else {
                    console.log("文档更新成功!更新数据条数:");
                    console.log(res);
                  }
                }
              );
          }
        }
      }
    );
  },
  /**
   * 查找数据
   * options:{
   *    collections: String 连接那个集合(必填)
   *    findFlag:  String 查询的标识(选填,默认查询多条) one:查询一条  many:查询多条
   *    findCriteria: Object 查询条件（选填）默认不填是查询此集合的所有数据
   *    fail(err): Function 更新失败的回调(选填) 默认打印失败信息
   *    success(result): Function 更新成功的回调(选填,会把查询结果传入回调) 默认打印成功信息
   * }
   */
  find: options => {
    // 连接数据库
    MongoClient.connect(
      url,
      { useNewUrlParser: true },
      (err, client) => {
        if (err) {
          // 关闭数据库连接
          client.close();
          if (!options.fail) {
            console.log(err);
          } else {
            // 执行
            options.fail(err);
          }
        } else {
          // 连接集合
          const dbc = client.db(dbname);
          // 判断用户查询的是所有数据还是带有条件
          if (!options.findCriteria) {
            // 查询的是所有的数据
            dbc
              .collection(options.collections)
              .find({})
              .toArray((err, result) => {
                // 关闭数据库
                client.close();
                if (err) {
                  console.log(err);
                  return false;
                }
                options.success(result);
              });
          } else {
            // 带条件的查询
            // 判断查询的是一条还是多条
            if (!options.findFlag || options.findFlag == "many") {
              // 不传findFlag 或传入的是many  查询多条
              console.log(options.findCriteria);
              dbc
                .collection(options.collections)
                .find(options.findCriteria)
                .toArray((err, result) => {
                  // 关闭数据库
                  client.close();
                  if (err) {
                    console.log(err);
                    return false;
                  }
                  options.success(result);
                });
            } else if (options.findFlag == "one") {
              // 查询一条
              dbc
                .collection(options.collections)
                .findOne(options.findCriteria, (err, doc) => {
                  // 关闭数据库
                  client.close();
                  if (options.success) {
                    options.success(doc);
                  } else {
                    console.log("查询结果如下:");
                    console.log(doc);
                  }
                });
            }
          }
        }
      }
    );
  }
};

// 导出模块
module.exports = db;
