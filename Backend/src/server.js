const http = require("http");
const app = require("./app");
const port = 3000;


const server = http.createServer(app);

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1); 
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});