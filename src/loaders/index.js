import expressLoader from './express-loader.js';
import mongoLoader from './mongo-loader.js';

export default async function init(server) {
    expressLoader(server);
    await mongoLoader();
}
