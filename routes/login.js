/**
 * Created by waver on 2017/5/9.
 */
var models =  require('../models');
var express = require('express');
var router = express.Router();
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();

/* GET users listing. */
router.get('/', function(req, res, next) {
    logger.info('user:[' + req.ip + '] open login.html');
    res.render('login');
});

router.post('/', function (req, res) {
    logger.info('user:[' + req.ip + '] begin to login');
    var name = req.body.name,
        password = req.body.password;
    if(!name || 0===name.length || !password || 0===password.length) {
        return res.send({'msg': '登录失败！'});
    }
    models.User.findOne({
        where: {
            name: name,
            password: password
        }
    }).then(function (user) {
        if(!user) {
            logger.info('user:[' + req.ip + '] 登录失败！');
            return res.send({'msg': '登录失败！'});
        }
        req.session.user = user.name;
        req.session.corp = user.corp;
        req.session.auth = user.auth;
        logger.info('user:[' + req.session.user + '] login success');
        return res.send({'msg': 'success'});
    }).catch(function (error) {
        logger.error('user:[' + req.ip + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    })
});

module.exports = router;
