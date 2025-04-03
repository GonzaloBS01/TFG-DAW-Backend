import config from './config.js';
import app from './app.js';
import init from './loaders/index.js';
const { port } = config;

init(app).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
