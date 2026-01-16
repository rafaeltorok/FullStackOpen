import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schemas/schema.js";
import { resolvers } from "./resolvers/resolvers.js";
import jwt from "jsonwebtoken";
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

const startServer = (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => {
      const auth = req.headers.authorization;
      const currentUser = await getUserFromAuthHeader(auth);
      return { currentUser };
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
};

export default startServer;
