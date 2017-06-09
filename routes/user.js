/**
 * Created by waver on 2017/5/10.
 */
var models =  require('../models');
var express = require('express');
var router = express.Router();
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();

router.get('/', function(req, res) {
    logger.info('user:[' + req.session.user + '] open user.html');
    var result = {};
    models.User.findAll().then(function(users) {
        result.users = users;
    }).then(function() {
        return models.Corporation.findAll({
            attributes: ['code', 'name']
        });
    }).then(function (corplist) {
        logger.info('user:[' + req.session.user + '] user.html initialize');
        return res.render('user', {'users': result.users, 'corps': corplist, 'admin': req.session.corp==='admi'});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

router.post('/upsert', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to upsert user');
    models.User.upsert({
        'name': req.body.name,
        'password': req.body.password,
        'corp': req.body.corp,
        'auth': isNaN(parseInt(req.body.auth)) ? 0 : req.body.auth
    }).then(function (result) {
        logger.info('user:[' + req.session.user + '] upsert user finished');
        return res.send({'msg': 'success', 'upsert': result});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

module.exports = router;