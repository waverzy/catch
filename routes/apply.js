/**
 * Created by waver on 2017/7/21.
 */
var models =  require('../models');
var express = require('express');
var router = express.Router();
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();

var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var Promise = require('bluebird');
var YunpianSms = Promise.promisifyAll(require('../core/yunpianSms')).YunpianSms;
var sms = new YunpianSms();

router.get('/', function(req, res, next) {
    logger.info('user:[' + req.ip + '] open apply.html');
    res.render('apply', {'login': true});
});

router.post('/', function (req, res) {
    logger.info('user:[' + req.ip + '] begin to apply');
    var name = req.body.name,
        linkman = req.body.linkman,
        tel = req.body.tel,
        note = req.body.note;
    if(!name || 0===name.length || !tel || 0===tel.length) {
        return res.send({'msg': '请填写名称和联系电话！'});
    }
    models.Apply.create({
        name: name,
        linkman: linkman,
        tel: tel,
        note: note
    }).then(function () {
        logger.info('user:[' + req.ip + '] insert apply info finished');
        var smsData = {};
        smsData.name = name;
        smsData.tel = tel;
        return sms.sendApplyMsgAsync(smsData);
    }).then(function () {
        return res.send({'msg': 'success'});
    }).catch(function (error) {
        logger.error('user:[' + req.ip + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

module.exports = router;