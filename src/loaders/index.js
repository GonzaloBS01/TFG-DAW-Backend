import expressLoader from './express-loader.js';
import mongoLoader from './mongo-loader.js';

export default async function init(server, config) {
    await mongoLoader(config.database);
    expressLoader(server);
}
