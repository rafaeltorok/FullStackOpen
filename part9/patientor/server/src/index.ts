// Express app
import getApp from "./app";

const app = getApp();
const PORT: number = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
