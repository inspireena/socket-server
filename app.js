var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const socketIo = require("socket.io");
const http = require("http");

var app = express();

const server = http.createServer(app);

const options = {
  allowEIO3: true,
  maxHttpBufferSize: 10e7
};

options.cors = { origin: ['http://localhost:3000'] };

const io = socketIo(options).listen(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

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

