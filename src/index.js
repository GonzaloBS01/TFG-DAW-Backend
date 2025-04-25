import config from './config.js';
import app from './app.js';

import logger from './utils/logger.js';

const { port } = config;

app.listen(port, () => {
logger.info(`Server is running on port ${port}`);
});
