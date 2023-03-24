var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const socketIo = require("socket.io");
const http = require("http");

var app = express();

const server = http.createServer(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const socketConfig = {
  allowEIO3: true,
  maxHttpBufferSize: 10e7,
  cors: { origin: ['http://localhost:3000'] }
};

const io = socketIo(socketConfig).listen(server);

io.on("connection", (socket) => {
  // send a message to the client
  console.log('socket====', socket.id);
  socket.emit("to_client", { data: 'hello from server' });

  // receive a message from the client
  socket.on("on_server", (data) => {
    console.log('data from client==', data);
  });
});

server.listen(8000, () => console.log(`Listening on port ${8000}`));

