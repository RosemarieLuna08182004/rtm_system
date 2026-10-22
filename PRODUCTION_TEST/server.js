import app from './appExpress.js'
import http from "http";
export let httpServer = typeof http.createServer;
// Connect to the database
const SERVER_PORT = 8080
const SERVER_HOSTNAME = "localhost"

export const main = () => {
   try {
     // Start server
     httpServer = http.createServer(app);
     httpServer.listen(SERVER_PORT, () => {
       console.log("----------------------------------------");
       console.log(
         `Server started on :: ${SERVER_HOSTNAME}:${SERVER_PORT}`,
       );
       console.log("----------------------------------------");
     });
 
     // Graceful shutdown
     const Shutdown = (callback) =>
       httpServer && httpServer.close(callback);
 
     process.on('SIGTERM', Shutdown)
     process.on('SIGINT', Shutdown)
   } catch (error) {
    console.error('Failed to connect to the database:', error)
    process.exit(1) // Exit with failure code
   }
  }

main()