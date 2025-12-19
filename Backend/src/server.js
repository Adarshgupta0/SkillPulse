const http = require("http");
const app = require("./app");
const port = 3000;
const connectToDb = require("./config/DBconnect");

const server = http.createServer(app);

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1); 
});

(async () => {
  try {
    await connectToDb();
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
