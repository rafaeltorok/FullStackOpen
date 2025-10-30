const app = require('./app.js');
const config = require('./utils/config.js');

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
});