const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./config/db");

const { graphqlHTTP } = require("express-graphql"); // express中graphql的库
const schema = require("./schema/schema");

const PORT = process.env.PORT || 5000;

const app = express();

// connect to databse
connectDB();

app.use(cors());

// 使用graphql作为中间件
// 通过浏览器：http://localhost:3000/graphql 查看可视化界面
app.use(
  "/graphql", // 固定的访问路径，所有请求都通过 /graphql
  graphqlHTTP({
    schema, // graphQL的schema
    graphiql: process.env.NODE_ENV === "development", // 在development环境下开启graphiql(GraphQL的可视化界面)
  })
);

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});

