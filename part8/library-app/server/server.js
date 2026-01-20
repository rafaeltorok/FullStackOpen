import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';

import cors from 'cors';
import express from 'express';
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
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {             // Apollo calls this object during server start
          return {                            // Another object is returned
            async drainServer() {             // Apollo calls this during shutdown
              await serverCleanup.dispose();  // Cleanup code
            },
          }
        },
      }
    ]
  });

  await server.start();

  app.use(
    '/graphql',
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
    console.log(`Server is now running on http://localhost:${port}/graphql`);
  });
};

export default startServer;
