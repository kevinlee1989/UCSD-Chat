// 기본적인 프론트엔드와 통신하기위한 파일.

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var app = express();
var expressWs = require('express-ws')(app);


// CORS를 활성화하여 다른 도메인에서 API 요청을 허용.
app.use(cors());

// 디렉토리안에있는 라우터 파일을 불러옴.
// 각 파일은 API기능을 담당.
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var courseRouter = require('./routes/course');
var wsRouter = require('./routes/websocket');
var chatRouter = require('./routes/chatroom');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint 등록.
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/course', courseRouter);
app.use('/echo', wsRouter);
app.use('/chatroom', chatRouter);

// 등록되지않은 URL로 요청이 들어오면 404 NOT FOUND에러 반환.
app.use(function(req, res, next) {
  next(createError(404));
});

// 에러 핸들러
app.use(function(err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  
  res.status(err.status || 500);
  res.render('error');
});

// 서버 실행.
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

module.exports = app;
