import { serverApp } from './core/server-app.js';

const server = await serverApp.init();

export { server };
