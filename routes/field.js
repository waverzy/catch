/**
 * Created by waver on 2017/6/12.
 */
var models =  require('../models');
var express = require('express');
var router = express.Router();
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();

router.get('/', function(req, res) {
    logger.info('user:[' + req.session.user + '] open field.html');
    models.Field.findAll().then(function(fields) {
        logger.info('user:[' + req.session.user + '] field.html initialize');
        return res.render('field', {'fields': fields, 'admin': req.session.corp==='admi'});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

router.post('/upsert', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to upsert field');
    models.Field.upsert({
        'id': req.body.id,
        'name': req.body.name
    }).then(function (result) {
        logger.info('user:[' + req.session.user + '] upsert field finished');
        return res.send({'msg': 'success', 'upsert': result});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

router.post('/delete', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to delete field');
    var fieldId = parseInt(req.body.id);
    models.Field.findOne({
        where: {id: fieldId}
    }).then(function (field) {
        if(field) {
            return field.destroy();
        } else {
            throw new Error('数据不存在！');
        }
    }).then(function () {
        logger.info('user:[' + req.session.user + '] delete field finished');
        return res.send({'msg': 'success'});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

module.exports = router;