import express from 'express';
import {
  ApolloServer,
} from 'apollo-server-express';
import path from 'path';
import {
  fileLoader,
  mergeTypes,
  mergeResolvers,
} from 'merge-graphql-schemas';
import cors from 'cors';

import models from './models';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const PORT = 8080;

const app = express();

app.use(cors('*'));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    models,
    user: {
      id: 1,
    },
  },
});
server.applyMiddleware({
  app,
});

models.sequelize.sync({
  force: false,
}).then(() => {
  app.listen({
    port: PORT,
  }, () => console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`));
});
