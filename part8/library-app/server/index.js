import connectToDatabase from "./db.js";
import startServer from "./server.js";
import dotenv from "dotenv";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;

const main = async () => {
  await connectToDatabase(MONGODB_URI);
  startServer(PORT);
};

main();
