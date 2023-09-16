import { serverApp } from './packages/core/server-app.js';

const server = await serverApp.init();

export { server };
