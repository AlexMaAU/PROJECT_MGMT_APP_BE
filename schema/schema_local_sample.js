const { projects, clients } = require("../sampleData");

const graphql = require("graphql");

const { GraphQLObjectType } = graphql; // 用于定义schema中的对象类型，graphQL是强类型的

// Client Type
// Type部分是定义RootQuery里每个sub query的类型样式
const ClientType = new GraphQLObjectType({
  // Client Type的名称
  name: "Client",
  // Client Type返回数据的类型
  fields: () => ({
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    email: { type: graphql.GraphQLString },
    phone: { type: graphql.GraphQLString },
  }),
});

// Project Type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    description: { type: graphql.GraphQLString },
    status: { type: graphql.GraphQLString },
    // 定义GraphQL里的内联数据，可以把foreign key直接拓展成完整的数据
    client: {
      type: ClientType,
      resolve(parent, args) {
        // parent表示父级project实例，project对象中有clientId
        // 不需要再传递args，graphql会自动根据project对象中的clientId进行匹配
        return clients.find((client) => client.id === parent.clientId);
      },
    },
  }),
});

// 把所有的Type都绑定到RootQuery，最终是通过RootQuery和GraphQL进行交互
// Root Query里的sub query是定义具体的请求逻辑
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    // clients sub query，返回所有的clients
    clients: {
      type: new graphql.GraphQLList(ClientType), // clients是数组类型，数组元素是ClientType类型
      resolve() {
        return clients;
      },
    },
    // client sub query，按照ID查询client
    client: {
      // client sub query的类型是ClientType
      type: ClientType,
      // Client Type接受的参数类型
      args: {
        id: { type: graphql.GraphQLID },
      },
      // 用于处理查询的实际数据获取。它的作用是在 GraphQL 查询被执行时，根据请求的字段和参数从数据源（例如数据库、API 或本地数据结构）中获取数据
      resolve(parent, args) {
        // 在 clients 数组中查找一个具有匹配 ID 的客户端对象, 找到的客户端对象会作为查询的结果返回给客户端
        return clients.find((client) => client.id === args.id);
      },
    },
    projects: {
      type: new graphql.GraphQLList(ProjectType),
      resolve() {
        return projects;
      },
    },
    project: {
      type: ProjectType,
      args: {
        id: { type: graphql.GraphQLID },
      },
      resolve(parent, args) {
        return projects.find((project) => project.id === args.id);
      },
    },
  }),
});

// 创建GraphQLSchema实例，绑定RootQuery
module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
});

// 在http://localhost:3000/graphql中输入下面代码进行查询

// 对应RootQuery里的client部分，接受id作为参数，然后查询Clients数组中的数据，设定只返回需要的id和name
// {
//   client(id:"1") {
//     id,
//     name
//   }
// }

// 只返回需要的id和name
// {
//   "data": {
//     "client": {
//       "id": "1",
//       "name": "Tony Stark"
//     }
//   }
// }

// 查询project query，根据clientId拓展需要的client数据
// {
//   project(id:"1") {
//     id,
//     name,
//     client {
//       name,
//       email
//     }
//   }
// }

// 返回结果会拓展client部分
// {
//   "data": {
//     "project": {
//       "id": "1",
//       "name": "eCommerce Website",
//       "client": {
//         "name": "Tony Stark",
//         "email": "ironman@gmail.com"
//       }
//     }
//   }
// }

