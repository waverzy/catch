var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var corporation = require('./routes/corporation');
var coupon = require('./routes/coupon');
var login = require('./routes/login');
var check = require('./routes/check');
var user = require('./routes/user');
var generate = require('./routes/generate');
var corprelation = require('./routes/corprelation');
var partner = require('./routes/partner');
var field = require('./routes/field');
var tip = require('./routes/tip');
var apply = require('./routes/apply');
var main = require('./routes/main');
var about = require('./routes/about');
var getCouponH5 = require('./routes/getCouponH5');
var public = require('./routes/public');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('catchsecret'));
app.use(express.static(path.join(__dirname, 'public')));

var models = require('./models');
var SequelizeStore = require('connect-session-sequelize')(session.Store);

app.use(session({
    secret: 'catchsecret',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: models.sequelize,
        checkExpirationInterval: 2*60*1000,
        expiration: 10*60*1000
    })
}));

var hbs = require('hbs');
hbs.registerHelper('add', function(value1, value2, options) {
    return value1+value2;
});

var log4js = require('./core/log4jsUtil.js'),
    log = log4js.getLogger();
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, 'config', 'config.json'))[env];

app.use('/getCouponH5', getCouponH5);
app.use('/main', main);
app.use('/about', about);
app.use('/', main);

app.use(function (req, res, next) {
    log.info('Process:' + process.pid + ' is processing');
    var url = req.originalUrl;
    if(url == "/login" || url == "/apply" || url.indexOf("public")>0 || url == "/favicon.ico") {
        next();
        return;
    }
    if(req.method == "GET") {
        if(!req.session.user || !req.session.auth) {
            return res.redirect("/login");
        }
        if(req.session.auth ) {
            var temp = config[url.substr(1)];
            if(!isNaN(temp) && req.session.auth[temp] === '1') {}
            else {
                log.error('user:[' + req.session.user + '] request ' + url + ' auth failed')
                return res.redirect("/login");
            }
        }
    } else {
        if(!req.session.user || !req.session.auth) {
            return res.send({'msg': 'logout'});
        }
        if(req.session.auth) {
            var secondIdx = url.indexOf('/', 1);
            var reqUrl = url.substr(1);
            if(secondIdx > 0) {
                reqUrl = url.substring(1, secondIdx);
            }
            var temp = config[reqUrl];
            if(!isNaN(temp) && req.session.auth[temp] === '1') {}
            else {
                log.error('user:[' + req.session.user + '] request ' + url + ' auth failed')
                return res.send({'msg': '非法请求，未授权！'});
            }
        }
    }

    next();
});

app.use('/index', index);
app.use('/corporation', corporation);
app.use('/coupon', coupon);
app.use('/check', check);
app.use('/user', user);
app.use('/login', login);
app.use('/generate', generate);
app.use('/corprelation', corprelation);
app.use('/partner', partner);
app.use('/field', field);
app.use('/tip', tip);
app.use('/apply', apply);
app.use('/public', public);
app.use('/getCouponH5', getCouponH5);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {'error': err.message});
});

process.on('uncaughtException', function(err){
    log.error(err); //注意这个错误信息并没有错误发生时的堆栈信息
});

module.exports = app;
