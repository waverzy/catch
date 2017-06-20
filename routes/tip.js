/**
 * Created by waver on 2017/6/19.
 */
var models =  require('../models');
var express = require('express');
var router = express.Router();
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();

router.get('/', function(req, res, next) {
    logger.info('user:[' + req.session.user + '] open tip.html');
    models.Tip.findAll().then(function(tips) {
        logger.info('user:[' + req.session.user + '] tip.html initialize');
        return res.render('tip', {'tips': tips, 'admin': req.session.corp==='admi'});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        next(error);
    });
});

router.post('/update', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to udpate tip');
    models.Tip.update({
        content: req.body.content,
        expiredate: req.body.expiredate,
        state: req.body.state},
        {
            where: {
                id: req.body.id
            }
    }).then(function () {
        logger.info('user:[' + req.session.user + '] update tip finished');
        return res.send({'msg': 'success'});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

router.post('/insert', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to insert tip');
    models.Tip.create({
        content: req.body.content,
        expiredate: req.body.expiredate,
        state: req.body.state
    }).then(function (result) {
        logger.info('user:[' + req.session.user + '] insert tip finished');
        return res.send({'msg': 'success'});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

router.post('/delete', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to delete tip');
    var tipId = parseInt(req.body.id);
    models.Tip.findOne({
        where: {id: tipId}
    }).then(function (tip) {
        if(tip) {
            return tip.destroy();
        } else {
            throw new Error('数据不存在！');
        }
    }).then(function () {
        logger.info('user:[' + req.session.user + '] delete tip finished');
        return res.send({'msg': 'success'});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

module.exports = router;