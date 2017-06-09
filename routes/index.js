var models =  require('../models');
var express = require('express');
var router = express.Router();
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();

/* GET home page. */
router.get('/', function(req, res) {
    logger.info('user:[' + req.session.user + '] open index.html');
    return res.render('index', {'admin': req.session.corp==='admi'});
});

router.post('/logout', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to logout');
    res.clearCookie('connect.sid', { path: '/' });
    return res.end();
});

module.exports = router;
