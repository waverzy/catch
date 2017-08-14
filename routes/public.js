/**
 * Created by waver on 2017/8/14.
 */
var express = require('express');
var router = express.Router();
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();
var svgCaptcha = require('svg-captcha');
var models =  require('../models');

var utils = require('../core/utils');
var Promise = require('bluebird');
var generator = require('../core/generator');
var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var YunpianSms = Promise.promisifyAll(require('../core/yunpianSms')).YunpianSms;
var sms = new YunpianSms();

router.get('/numPic', function (req, res) {
    logger.info('user:[' + req.ip + '] get numPic');
    var captcha = svgCaptcha.create({
        // 翻转颜色
        inverse: false,
        // 字体大小
        fontSize: 36,
        // 噪声线条数
        noise: 3,
        // 宽度
        width: 120,
        // 高度
        height: 30
    });
    req.session.captcha = captcha.text.toLowerCase();
    res.send(captcha.data);
});

router.post('/getMsg', function (req, res) {
    var mobile = req.body.mobile;
    logger.info('user:[' + req.ip + ']mobile:[' + mobile + '] get message code');
    if(!req.body.picNum || req.body.picNum.toLowerCase() != req.session.captcha) {
        return res.send({'msg': '图片验证码错误，请重新输入！'});
    } else {
        req.session.mobile = mobile;
        var num = Math.ceil(Math.random()*8999 + 1000);
        req.session.msgcode = num;
        var smsData = {};
        smsData.mobile = mobile.toString();
        smsData.code = num.toString();
        sms.sendValidateMsg(smsData, function(error, response) {
            if(!error) {
                var result = JSON.parse(response.body);
                if(result.code == 0) {
                    logger.info('mobile:[' + mobile + '] msgcode:[' + num + ']');
                    return res.send({'msg': 'success'});
                } else {
                    logger.error('user:[' + req.session.user + '] mobile:[' + mobile + '] send fail:' + result.msg);
                    return res.send({'msg': result.msg});
                }
            }
            else {
                logger.error('user:[' + req.session.user + '] ' + error.stack);
                return res.send({'msg': error.message});
            }
        });
    }
});

router.post('/getCoupon', function (req, res) {
    var mobile = req.body.mobile,
        msgcode = req.body.msgcode;
    if(mobile != req.session.mobile || msgcode != req.session.msgcode) {
        logger.info('user:[' + req.session.user + '] mobile:[' + mobile + '] validate msgcode fail!');
        return res.send({'msg': '手机验证未通过，请重新获取验证码！'});
    }
    var src = req.session.src || '',
        dest = req.body.dest || '';
    if(src.length == 0 || dest.length == 0) {
        logger.info('user:[' + req.session.user + '] mobile:[' + mobile + '] validate src fail!');
        return res.send({'msg': '未读到商家信息，请重新扫描商家二维码！'})
    }
    var num = 1,
        len = 9;
    var couponcode = {};
    var corpinfo = {};
    models.Corpdetail.findOne({
        where: {
            code: dest
        }
    }).then(function (detail) {
        corpinfo = detail;
        return models.Coupon.findAll({
            attributes: ['couponno']
        });
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
            expiredate: corpinfo.expiredate,
            discount: corpinfo.discount,
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
            return models.Corporation.findOne({
                where: {code: dest}
            });
        }
        throw new Error('统计表更新出错！')
    }).then(function (corporation) {
        var smsData = {};
        smsData.mobile = mobile.toString();
        smsData.name = corporation.name;
        smsData.couponcode = couponcode;
        smsData.expiredate = corpinfo.expiredate;
        smsData.address = corpinfo.address;
        smsData.discount = corpinfo.discount;
        return sms.sendCouponMsgAsync(smsData);
    }).then(function (response) {
        var result = JSON.parse(response.body);
        if(result.code == 0) {
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
