/**
 * Server entry point
 * ESM version - minimal and clean
 */

import createApp from './app.ts';

// Run the application
const server = await createApp();

// Export server for testing purposes
export { server };

export default server;
