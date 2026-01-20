import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import http from 'http';
import jwt from "jsonwebtoken";

import { typeDefs } from "./schemas/schema.js";
import { resolvers } from "./resolvers/resolvers.js";
import User from "./models/user.js";

const getUserFromAuthHeader = async (auth) => {
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  try {
    const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);
    return await User.findById(decodedToken.id);
  } catch (error) {
    return null;
  }
};

const startServer = async (port) => {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });

  await server.start();

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization;
        const currentUser = await getUserFromAuthHeader(auth);
        return { currentUser };
      }
    })
  );

  httpServer.listen(port, () => {
    console.log(`Server is now running on http://localhost:${port}`);
  });
};

export default startServer;
