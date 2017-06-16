/**
 * Created by waver on 2017/4/28.
 */
var models =  require('../models');
var express = require('express');
var router = express.Router();
var generator = require('../core/generator');
var utils = require('../core/utils');
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();

router.get('/', function(req, res, next) {
    logger.info('user:[' + req.session.user + '] open coupon.html');
    var result = {};
    models.Couponstat.findAll().then(function (stats) {
        result.stats = stats;
        return models.Corporation.findAll({
            attributes: ['code', 'name']
        });
    }).then(function (corplist) {
        logger.info('user:[' + req.session.user + '] coupon.html initialize');
        return res.render('coupon', {'stats': result.stats, 'corplist': corplist, 'admin': req.session.corp==='admi'});
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        next(error);
    });
});

router.post('/create', function (req, res) {
    logger.info('user:[' + req.session.user + '] begin to generate coupons');
    var src = req.body.src || '';
    var dest = req.body.dest || '';
    var discount = req.body.discount || '';
    if(src.length == 0 || dest.length == 0) {
        return res.send({'msg': '源机构或目的机构为空！'})
    }
    var num = parseInt(req.body.num, 10),
        len = parseInt(req.body.len, 10);
    num = (isNaN(num)||num<=0) ? 10 : num;
    len = (isNaN(len)||len>9||len<0) ? 9 : len;
    var couponResults = [];
    models.Coupon.findAll({
        attributes: ['couponno']
    }).then(function (numbers) {
        var couponcodes = [];
        var couponnos = [];
        while(couponcodes.length < num) {
            var tempCodes = generator(src, dest, num-couponcodes.length, len);
            for(var i=0; i<tempCodes.length; i++) {
                var couponno = utils.strToNum(tempCodes[i]);
                if(isNaN(couponno)) continue;
                if(!utils.binarySearch(couponno, numbers)) {
                    couponcodes.push(tempCodes[i]);
                    couponnos.push(couponno);
                }
            }
        }
        if(couponcodes.length !== couponnos.length) throw new Error('couponcodes与couponnos数量不一致！');
        var coupons = [];
        for(var j=0; j<couponcodes.length; j++) {
            var tempCoupon = {
                src: src,
                dest: dest,
                couponcode: couponcodes[j],
                couponno: couponnos[j],
                discount: discount,
                state: true
            };
            coupons.push(tempCoupon);
        }
        return models.Coupon.bulkCreate(coupons);
    }).then(function (results) {
        couponResults = results;
        return models.Couponstat.findOne({
            where: {src: src, dest: dest}
        });
    }).then(function (couponstat) {
        if(couponstat) {
            couponstat.totalnum += couponResults.length;
            return couponstat.save();
        }
        return models.Couponstat.build({
            src: src,
            dest: dest,
            totalnum: couponResults.length,
            usednum: 0}).save();
    }).then(function (newstat) {
        if(newstat) {
            logger.info('user:[' + req.session.user + '] generate finished');
            return res.send({'msg': 'success', 'coupons': couponResults});
        }
        throw new Error('统计表更新出错！')
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

router.post('/query', function (req, res) {
    var src = req.session.corp || '',
        dest = req.body.dest || '';
    if(src.length == 0 || dest.length == 0) {
        return res.send({'msg': '状态异常，请刷新页面或重新登录！'});
    }
    models.Coupon.findAll({
        where: {src: src, dest: dest}
    }).then(function (coupons) {
        if(coupons) {
            logger.info('user:[' + req.session.user + '] query coupons finished');
            return res.send({'msg': 'success', 'coupons': coupons});
        }
        throw new Error('不存在优惠券！')
    }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    });
});

module.exports = router;
