/**
 * Created by waver on 2017/6/8.
 */
var models =  require('../models');
var express = require('express');
var router = express.Router();
var utils = require('../core/utils');
var log4js = require('../core/log4jsUtil.js'),
    logger = log4js.getLogger();

router.get('/', function(req, res) {
    logger.info('user:[' + req.session.user + '] open partner.html');
    models.sequelize.query('SELECT c.code, c.name, d.address, d.description, d.picture FROM corporations c, corpdetails d WHERE c.state=true AND c.code=d.code AND c.code IN (SELECT dest FROM corprelations WHERE src=?)', { replacements: [req.session.corp], type: models.sequelize.QueryTypes.SELECT})
        .then(function(corps) {
            logger.info('user:[' + req.session.user + '] partner.html initialize ');
            return res.render('partner', {'corps': corps, 'admin': req.session.corp==='admi'});
        }).catch(function (error) {
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.render({'msg': '错误:' + error.message});
    });
});

router.post('/', function(req, res) {
    var couponcode = req.body.couponcode;
    var couponno = utils.strToNum(couponcode);
    // 避免日志异常导致正常流程失败 logger.info('user:[' + req.session.user + '] check coupon:[' + couponcode + ']');
    if(isNaN(couponno)) {
        logger.info('user:[' + req.session.user + '] 无效的优惠码！');
        return res.send({'msg': '无效的优惠码！'});
    }
    var result = {};
    result.success = false;
    var expected = false;
    models.Coupon.findOne({
        where: {
            couponno: couponno
        }
    }).then(function (coupon) {
        if(coupon && coupon.state && coupon.src===req.session.corp) {
            result.coupon = coupon;
            result.success = true;
            return coupon.update({'state': false}, {fields: ['state']});
        }
        if(coupon && !coupon.state) {
            expected = true;
            throw new Error('优惠码已被使用！');
        }
        expected = true;
        throw new Error('优惠码无效！');
    }).then(function () {
        //update success
        //插入用户信息
        return models.Couponstat.findOne({
            where: {
                src: result.coupon.src,
                dest: result.coupon.dest
            }
        });
    }).then(function (stat) {
        if(stat) {
            return stat.update({'usednum': stat.usednum+1});
        }
        expected = true;
        throw new Error('统计表不存在相关信息！')
    }).then(function () {
        logger.info('user:[' + req.session.user + '] check finished ');
        return res.send({'msg': 'success', 'discount': result.coupon.discount});
    }).catch(function (error) {
        if(result.success) {
            logger.info('user:[' + req.session.user + '] ' + error.message);
            return res.send({'msg': 'success', 'discount': result.coupon.discount});
        }
        if(expected) {
            logger.info('user:[' + req.session.user + '] ' + error.message);
            return res.send({'msg': error.message});
        }
        logger.error('user:[' + req.session.user + '] ' + error.stack);
        return res.send({'msg': '错误:' + error.message});
    })
});

module.exports = router;