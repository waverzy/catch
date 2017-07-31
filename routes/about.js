/**
 * Created by waver on 2017/7/31.
 */
var express = require('express');
var router = express.Router();
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();

router.get('/', function(req, res) {
    logger.info('user:[' + req.ip + '] open about.html');
    res.render('about', {layout: false});
});

module.exports = router;
