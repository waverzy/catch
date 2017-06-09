/**
 * Created by waver on 2017/5/31.
 */
var models =  require('../models');
var express = require('express');
var router = express.Router();
var utils = require('../core/utils');
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();
var Promise = require('bluebird');
var TopClient = Promise.promisifyAll(require('../core/topClient')).TopClient;
var client = new TopClient({
    'appkey' : '23884651' ,
    'appsecret' : 'dcc381043b275331cd8ae1a5e0d94034' ,
    'REST_URL' : 'http://gw.api.taobao.com/router/rest'
});
var generator = require('../core/generator');
var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

router.get('/', function(req, res) {
    logger.info('user:[' + req.session.user + '] open generate.html');
    models.Corprelation.findAll({
        where: {
            src: req.session.corp,
            state: true
        }
    }).then(function(corplist) {
        logger.info('user:[' + req.session.user + '] generate.html initialize');
        return res.render('generate', {'corplist': corplist, 'admin': req.session.corp==='admi'});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

router.post('/msg', function(req, res) {
    var mobile = req.body.mobile;
    if(!/^1(3|4|5|7|8)[0-9]\d{8}$/.test(mobile)) {
        logger.info('user:[' + req.session.user + '] 非法的手机号！');
        return res.send({'msg': '非法的手机号！'});
    }
    req.session.mobile = mobile;
    var num = Math.ceil(Math.random()*8999 + 1000);
    req.session.msgcode = num;
    client.execute( 'alibaba.aliqin.fc.sms.num.send' , {
        'extend' : '' ,
        'sms_type' : 'normal' ,
        'sms_free_sign_name' : config.sms_free_sign_name ,
        'sms_param' : {"msgcode": num.toString()} ,
        'rec_num' : mobile.toString() ,
        'sms_template_code' : config.validate_template
    }, function(error, response) {
        if(!error) {
            if(response.result.success) {
                logger.info('mobile:[' + mobile + '] msgcode:[' + num + ']');
                return res.send({'msg': 'success'});
            } else {
                logger.error('user:[' + req.session.user + '] mobile:[' + mobile + '] send fail:' + response.result.msg);
                return res.send({'msg': response.result.msg});
            }

        }
        else {
            logger.error('user:[' + req.session.user + '] ' + error.stack);
            return res.send({'msg': error.message});
        }
    });
});

router.post('/', function (req, res) {
    var mobile = req.body.mobile,
        msgcode = req.body.msgcode;
    if(mobile != req.session.mobile || msgcode != req.session.msgcode) {
        logger.info('user:[' + req.session.user + '] mobile:[' + mobile + '] validate msgcode fail!');
        return res.send({'msg': '手机验证未通过，请重新获取验证码！'});
    }
    var src = req.session.corp || '',
        dest = req.body.dest || '',
        destname = req.body.destname || '';
    if(src.length == 0 || dest.length == 0 || destname.length == 0) {
        logger.info('user:[' + req.session.user + '] mobile:[' + mobile + '] validate corp fail!');
        return res.send({'msg': '源机构或目的机构为空！'})
    }
    var num = 1,
        len = 9;
    var couponcode = {};
    models.Coupon.findAll({
        attributes: ['couponno']
    }).then(function (numbers) {
        var goon = true;
        var couponno = {};
        while(goon) {
            var tempCodes = generator(src, dest, num, len);
            if(!tempCodes || tempCodes.length!==1) {
                throw new Error('生成优惠券出错！');
            }
            couponcode = tempCodes[0];
            couponno = utils.strToNum(couponcode);
            if(isNaN(couponno)) continue;
            if(!utils.binarySearch(couponno, numbers)) {
                goon = false;
            }
        }
        var tempCoupon = {
            src: src,
            dest: dest,
            couponcode: couponcode,
            couponno: couponno,
            discount: '',
            customer: mobile,
            state: true
        };
        return models.Coupon.create(tempCoupon);
    }).then(function () {
        return models.Couponstat.findOne({
            where: {src: src, dest: dest}
        });
    }).then(function (couponstat) {
        if(couponstat) {
            couponstat.totalnum += num;
            return couponstat.save();
        }
        return models.Couponstat.build({
            src: src,
            dest: dest,
            totalnum: num,
            usednum: 0}).save();
    }).then(function (newstat) {
        if(newstat) {
            logger.info('user:[' + req.session.user + '] generate finished');
            //获取地址
            return models.Corpdetail.findOne({
                where: {code: dest}
            });
        }
        throw new Error('统计表更新出错！')
    }).then(function (corpdetail) {
        return client.executeAsync( 'alibaba.aliqin.fc.sms.num.send' , {
            'extend' : '' ,
            'sms_type' : 'normal' ,
            'sms_free_sign_name' : config.sms_free_sign_name ,
            'sms_param' : {"name": destname, "couponcode": couponcode} ,
            'rec_num' : mobile.toString() ,
            'sms_template_code' : config.notify_template
        });
    }).then(function (response) {
        if(response.result.success) {
            logger.info('mobile:[' + mobile + '] couponcode:[' + couponcode + ']');
            return res.send({'msg': 'success'});
        } else {
            logger.error('user:[' + req.session.user + '] mobile:[' + mobile + '] send fail:' + response.result.msg);
            return res.send({'msg': response.result.msg});
        }
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

module.exports = router;