var express = require('express');
var http = require('http')
var path = require('path');
var config = require('./config');
var log = require('./libs/log')(module);


var app = express();

//app.engine('ejs', require('ejs-locals')); // !!! This library is unmaintained
app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');


//---Connect's middlewares ----------------

app.use(express.favicon()); // якщо є такий URL /favicon.ico, то видає іконку, інакше передає управління далі
// app.use(express.logger('dev')); // GET /404 7ms, 'dev' - формат логування
if (app.get('env') == 'development') {
  app.use(express.logger('dev')); // option - immediate
} else {
  app.use(express.logger('default'));
}

app.use(express.bodyParser()); // form application/json, дані доступні через req.body...

app.use(express.cookieParser()); // req.cookies   (парсінг куки req.headers) 

//----------------------------

app.use(app.router); // дозволяє говорити, які запити як будуть опрацьовані

app.get('/', function (req, res, next) {
  res.render("page", { 
    start: 'Start page'  // передаєм змінну в шаблон
  });
});

app.use(express.static(path.join(__dirname, 'public'))); // якщо ніякі middlewares вище запит не опрацювали, 
                                                          // тоді управління передається цьому middleware і він дивиться 
                                                          // у 'public' відповідний файл


app.use(function(err, req, res, next) { 
  // якщо не вказано явно NODE_ENV = 'production', то env = 'development'
  if (app.get('env') == 'development') {
    var errorHandler = express.errorHandler();
    errorHandler(err, req, res, next); // це спрацює
  } else {
    res.send(500);
  }
});

// var routes = require('./routes')
// var user = require('./routes/user')



// // all environments






// app.get('/', routes.index);
// app.get('/users', user.list);

http.createServer(app).listen(config.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});

















 
//Middleware
// app.use(function (req, res, next) {
//   if (req.url == '/') {
//     res.end("Hello"); 
//   } else {
//     next();
//   }
// });

// app.use(function (req, res, next) {
//   if (req.url == '/forbidden') {
//     next(new Error('wops, denied'));
//   } else {
//     next();
//   }
// });

// app.use(function (req, res, next) {
//   if (req.url == '/test') {
//     res.end("Test"); 
//   } else {
//     next();
//   }
// });

// app.use(function(req, res) {
//   res.send(404, "Page Not Found Sorry");
// });