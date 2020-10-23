const xss = require("xss");

const { exec } = require("../db/mysql");
// 博客列表
const getList = async (author, keyword) => {
  // 1=1 的作用只是占位置，目的是为了便于拼接下方的逻辑。
  let sql = `select * from blogs where 1=1 `;
  // 如果有作者
  if (author) {
    sql += `and author = '${author}' `;
  }
  // 如果有作者
  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }
  sql += `order by createtime desc;`;
  return await exec(sql);
};
// 博客详情
const getDetail = async (id) => {
  const sql = `select * from blogs where id=${id};`;
  const rows = await exec(sql);
  return rows[0];
};
// 新建博客
const newBlog = async (blogData = {}) => {
  const title = xss(blogData.title);
  const content = xss(blogData.content);
  const author = blogData.author;
  const createTime = Date.now();
  const sql = `insert into blogs (title,content,createtime,author) values('${title}','${content}',${createTime},'${author}');`;

  const insertData = await exec(sql);
  return {
    id: insertData.insertId,
  };
};
// 更新博客
const updataBlog = async (id, blogData = {}) => {
  // id为更新博客的ID
  const title = blogData.title;
  const content = blogData.content;
  const sql = `update blogs set title='${title}',content='${content}' where id=${id};`;

  const updateData = await exec(sql);
  return updateData.affectedRows > 0;
};
// 删除博客
const delBlog = async (id, author) => {
  const sql = `delete from blogs where id='${id}' and author='${author}'`;
  // id 就是要删除博客的 ID
  const deleteData = await exec(sql);
  return deleteData.affectedRows > 0;
};
module.exports = {
  getList,
  getDetail,
  newBlog,
  updataBlog,
  delBlog,
};
